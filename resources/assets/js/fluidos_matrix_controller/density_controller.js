import angular from 'angular';
import matrixApp from './app.js';

matrixApp.controller('DensityController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.tvd = '';
    $scope.bhp = '';
    $scope.bht = '';
    $scope.gas = '0';

    $scope.density = () => {
        let {tvd, bhp, bht, gas} = $scope;
        let error = null;
        if (tvd === '' && bhp === '' && bht === '') error = '';
        else if (tvd === '' || bhp === '' || bht === '') error = 'Datos insuficientes';
        if (error !== null) {
            $rootScope.$broadcast('densityChanged', null);
            return error;
        }
        tvd = Number(tvd);
        bhp = Number(bhp);
        bht = Number(bht);
        gas = gas === '0' ? false : true;
        try {
            let dens = calcDensity(tvd, bhp, bht, gas);
            $rootScope.$broadcast('densityChanged', Number(dens));
            return `${dens.toFixed(2)} ppg`;
        } catch (ex) {
            $rootScope.$broadcast('densityChanged', null);
            let display_msg = 'No es posible calcular densidad.';
            if (ex instanceof RangeError && ex.ppg) {
                let val = ex.ppg.toFixed(2);
                display_msg += ` No se tienen valores de coeficiente
                                 de expansion térmica y coeficiente
                                 de compresibilidad. Se intentaron calcular
                                 para densidad = ${val} ppg.`;
            }
            return display_msg;
        }
    };
}]);

function calcDensity(tvd, bhp, bht, gas) {
    let securityFactor = gas ? 300 : 200;
    let bhps = bhp + securityFactor;
    let grad = bhps / tvd;
    let ppg = grad / 0.052;
    let surf = 80;          // TODO: input for surface temperature
    let {thermalExpansion: a, compresibility: b} = getFactors(ppg);
    let ct = a * (bht - surf) / 200;
    let cp = b * (bhps) / 2000;
    return ppg + ct - cp;
}

function getFactors(ppg) {
    for (let elem of factorTable) {
        if (ppg < 8.4)
            break;
        if (elem.cond(ppg)) return elem.factors;
    }

    // Not a single elem of table matched the cond
    throw new PpgRangeError(
        `Can't calculate thermal expansion factor. ppg=${ppg}`,
        ppg);
}

class PpgRangeError extends RangeError {
    constructor(msg, ppg) {
        super(msg);
        this.ppg = ppg;
    }
}

// cond must be checked in order
let factorTable = [
    {
        cond: ppg => ppg >= 8.4 && ppg <= 9.0,
        factors: {
            thermalExpansion: 0.0017,
            compresibility: 0.38e-6
        }
    },
    {
        cond: ppg => ppg <= 11.0,
        factors: {
            thermalExpansion: 0.0025,
            compresibility: 0.38e-6
        }
    },
    {
        cond: ppg => ppg <= 14.5,
        factors: {
            thermalExpansion: 0.0033,
            compresibility: 0.38e-6
        }
    },
    {
        cond: ppg => ppg <= 17.0,
        factors: {
            thermalExpansion: 0.0044,
            compresibility: 0.38e-6
        }
    },
    {
        cond: ppg => ppg <= 19.2,
        factors: {
            thermalExpansion: 0.0046,
            compresibility: 0.38e-6
        }
    },
];