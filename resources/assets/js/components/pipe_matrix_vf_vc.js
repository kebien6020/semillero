import getRL from './pipe_matrix_get_rl.js'

export default function (intermediate) {
// eslint-disable-next-line indent
return function
vf_vc([qo, qw, qg, api, rhoW, rhoG, muO, muW, muG, sigmaO, sigmaW, id]) {
    // vl
    const rhoO = 141.5 / (131.5 + api) * 62.4
    intermediate('rhoO', 'Densidad del Petróleo (lb/ft^3)', rhoO)

    const wo = (qo * 0.1061218411) * rhoO
    intermediate('wo', 'Flujo másico del Petróleo (lb/s)', wo)

    const ww = (qw * 0.1061218411) * rhoW
    intermediate('ww', 'Flujo másico del Agua (lb/s)', ww)

    const wl = wo + ww
    intermediate('wl', 'Flujo másico de la fracción Líquida (lb/s)', wl)

    const wg = qg * rhoG * 0.01889970456
    intermediate('wg', 'Flujo másico del Gas (lb/s)', wg)

    const water_cut = qw / (qw + qo)
    intermediate('water_cut', 'Corte de Agua', water_cut)

    const muL = water_cut > 0.5 ? muW : muO
    intermediate('muL', 'Viscosidad de la fracción Líquida (cp)', muL)

    const sigmaL = water_cut > 0.5 ? sigmaW : sigmaO
    intermediate('sigmaL', 'Tensión Superficial de la fracción Líquida (dina/cm)', sigmaL)

    const area = Math.PI * (id*id) / 4 * (0.3048/144)
    intermediate('area', 'Area (m^2)', area)

    const gt = (wl + wg) / area * 0.0000003950923998
    intermediate('gt', 'GT', gt)

    const rhoL = water_cut > 0.5 ? rhoW : rhoO
    intermediate('rhoL', 'Densidad de la fracción Líquida (lb/ft^3)', rhoL)

    const x = Math.pow(wl / wg, 0.9)
            * Math.pow(muL, 0.19)
            * Math.pow(sigmaL, 0.205)
            * Math.pow(rhoG, 0.7)
            * Math.pow(muG, 2.75) / (Math.pow(gt, 0.435) * Math.pow(rhoL, 0.72))
    intermediate('x', 'X', x)

    const rl = getRL(x)
    intermediate('rl', 'RL', rl)

    const vl = wl / (1097.28 * rl * rhoL * area)
    intermediate('vl', 'VL (ft/s)', vl)

    // vc
    const vc = 100 / Math.sqrt(rhoL * 0.01602)
    intermediate('vc', 'VC (ft/s)', vc)

    return vl > vc
}

}
