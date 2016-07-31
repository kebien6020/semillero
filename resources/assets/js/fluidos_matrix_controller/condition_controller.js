import angular from 'angular';
import matrixApp from './app.js';

matrixApp.controller('ConditionController', ['$scope', '$sce', '$rootScope', function($scope, $sce, $rootScope) {

    // Initial data processing
    conditions.forEach(cond => {
        cond.show = true;
        cond.display = $sce.trustAsHtml(cond.display);
    });

    fluids.forEach(fluid => {
        fluid.display = $sce.trustAsHtml(fluid.display);
    });

    // Scope variables
    $scope.conditions = conditions;
    $scope.recommendations = fluids;
    $scope.ilita = false;
    $scope.mont = false;
    $scope.showShales = false;
    $scope.showAll = false;

    // Bind event handlers
    //   Update on densityChanged
    $rootScope.$on('densityChanged', (event, density) => {
        // Update valid conditions
        update(density, $scope);
        
    });
}]);

function update(density, $scope) {
    if (density === null){
        $scope.conditions.forEach(cond => {cond.show = false;});
        $scope.recommendations = [];
        $scope.showShales = false;
        $scope.showAll = false;
        return;
    }
    $scope.showShales = true;
    $scope.showAll = true;
    let validFluids = fluids.filter(fluid => density < fluid.max);
    updateConditions(density, $scope, validFluids);
    updateRecommendations($scope, validFluids);
}

function updateConditions(density, {conditions}, validFluids) {
    for (let cond of conditions) {
        // If there is any validFluid for this condition show it
        cond.show = validFluids.some(fluid => fluidInCond(fluid, cond));
    }
}

function updateRecommendations($scope, validFluids) {
    // Get checked conditions
    let chkConditions = $scope.conditions.filter(cond => cond.checked && cond.show);
    let chkShale = $scope.ilita || $scope.mont;
    // Get the fluids which follow all checked conditions
    $scope.recommendations = validFluids.filter( (fluid) => {
        // Discard if it can not handle shale
        if (chkShale && validShale.indexOf(fluid.name) === -1)
            return false;
        // Check that it complies with every other cond
        return chkConditions.every(cond => fluidInCond(fluid, cond));
    });

}

function fluidInCond(fluid, cond) {
    return cond.valid.indexOf(fluid.name) !== -1;
}

let validShale = [
    'kcl',
    'nacl',
    'nacooh',
    'nabr',
    'kcooh',
    'cscooh',
];

let conditions = [
    {
        name: 'sulf',
        display: `
            Sulfatadas y/o Cloruradas cálcicas y/o magnésicas
            (SO<sub>4</sub><sup>-2</sup>,
            Cl<sup>-</sup>, Ca<sup>+2</sup>, 
            Mg<sup>+2</sup>)
        `,
        valid: [
            'nacooh',
            'nabr',
            'kcooh',
            'cscooh',
        ]
    },
    {
        name: 'bic-cal',
        display: `
            Bicarbonatadas cálcicas y/o magnésicas
            (HCO<sub>3</sub><sup>-</sup>,
            CO<sub>3</sub><sup>-2</sup>,
            Ca<sup>+2</sup>,
            Mg<sup>+2</sup>)
        `,
        valid: [
            'nacooh',
            'nabr',
            'cscooh',
        ]
    },
    {
        name: 'bic-sod',
        display: `
            Bicarbonatadas sodicas
            (HCO<sub>3</sub><sup>-</sup>,
            CO<sub>3</sub><sup>-2</sup>,
            Na<sup>+1</sup>,
            K<sup>+1</sup>)
        `,
        valid: [
            'nacl',
            'nacooh',
            'nabr',
            'cscooh',
        ]
    },
    {
        name: 'clor',
        display: `
            Cloruradas y/o Sulfatadas sódicas
            (SO<sub>4</sub><sup>-2</sup>,
            Cl<sup>-</sup>,
            Na<sup>+1</sup>,
            K<sup>+1</sup>)
        `,
        valid: [
            'nacl',
            'nacooh',
            'nabr',
            'kcooh',
            'cscooh',
        ]
    },
    {
        name: 't-mag',
        display: `
            Tipo magnésico
            (Mg<sup>+2</sup>)
        `,
        valid: [
            'kcl',
            'nacl',
            'nacooh',
            'cacl2',
            'nabr',
            'kcooh',
            'cabr2',
            'cscooh',
            'znbr2',
        ]
    },
    {
        name: 't-cal',
        display: `
            Tipo cálcico
            (Ca<sup>+2</sup>)
        `,
        valid: [
            'kcl',
            'nacl',
            'nacooh',
            'nabr',
            'kcooh',
            'cabr2',
            'cscooh',
            'znbr2',
        ]
    },
    {
        name: 't-sod',
        display: `
            Tipo sódico
            (Na<sup>+1</sup>,
            K<sup>+1</sup>)
        `,
        valid: [
            'kcl',
            'cacl2',
            'kcooh',
            'cabr2',
            'cscooh',
            'znbr2',
        ]
    },
    {
        name: 't-int',
        display: `
            Tipo intermedio
            (Ca<sup>+2</sup>,
            Na<sup>+1</sup>,
            K<sup>+1</sup>,
            Mg<sup>+2</sup>)
        `,
        valid: [
            'kcl',
            'nacl',
            'nacooh',
            'nabr',
            'cabr2',
            'cscooh',
        ]
    },
    {
        name: 't-bic',
        display: `
            Tipo Bicarbonatado
            (HCO<sub>3</sub><sup>-</sup>,
            CO<sub>3</sub><sup>-2</sup>)
        `,
        valid: [
            'kcl',
            'nacl',
            'nacooh',
            'nabr',
            'kcooh',
            'cscooh',
        ]
    },
    {
        name: 't-clo',
        display: `
            Tipo Clorurado
            (Cl<sup>-</sup>)
        `,
        valid: [
            'nacooh',
            'nabr',
            'kcooh',
            'cabr2',
            'cscooh',
            'znbr2',
        ]
    },
    {
        name: 't-int-2',
        display: `
            Tipo intermedio
            (HCO<sub>3</sub><sup>-</sup>,
            CO<sub>3</sub><sup>-2</sup>,
            SO<sub>4</sub><sup>-2</sup>,
            Cl<sup>-</sup>)
        `,
        valid: [
            'nacl',
            'nacooh',
            'nabr',
            'cscooh',
        ]
    },
    {
        name: 't-sulf',
        display: `
            Tipo Sulfatado
            (SO<sub>4</sub><sup>-2</sup>)
        `,
        valid: [
            'nacl',
            'nacooh',
            'nabr',
            'cscooh',
        ]
    },
];

let fluids = [
    {
        name: 'kcl',
        display: 'KCl (Cloruro de Potasio)',
        max: 9.7
    },
    {
        name: 'nacl',
        display: 'NaCl (Cloruro de Sodio)',
        max: 10
    },
    {
        name: 'nacooh',
        display: 'NaCOOH (Formiato de Sodio)',
        max: 11.1
    },
    {
        name: 'cacl2',
        display: 'CaCl<sub>2</sub> (Cloruro de Calcio)',
        max: 11.6
    },
    {
        name: 'nabr',
        display: 'NaBr (Bromuro de Sodio)',
        max: 12.7
    },
    {
        name: 'kcooh',
        display: 'KCOOH (Formiato de Potasio)',
        max: 13.1
    },
    {
        name: 'cabr2',
        display: 'CaBr<sub>2</sub> (Bromuro de Calcio)',
        max: 15.1
    },
    {
        name: 'cscooh',
        display: 'CsCOOH (Formiato de Cesio)',
        max: 19.2
    },
    {
        name: 'znbr2',
        display: 'ZnBr<sub>2</sub> (Bromuro de Zinc)',
        max: 20.5
    },
];
