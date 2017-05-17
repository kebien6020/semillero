import vf_vc_temp from './pipe_matrix_vf_vc.js'
import React from 'react'

export default function questions(intermediate) {

/* eslint-disable indent */
const vf_vc = vf_vc_temp(intermediate)
const questions = [
    {
        name: 'system_type',
        text: 'Tipo de Sistema',
        type: 'multi',
        options: [
            {
                name: 'gc',
                text: 'Gas Condensado'
            },
            {
                name: 'liq',
                text: 'Líquido'
            }
        ],
        actions: {
            'gc': [
                {
                    type: 'question',
                    name: 'water_cut_1'
                }
            ],
            'liq': [
                {
                    type: 'question',
                    name: 'water_cut_2'
                }
            ]
        }
    },
    {
        name: 'water_cut_1',
        text: 'Corte de Agua > 20%',
        type: 'boolean',
        actions: {
            'true': [
                {
                    type: 'question',
                    name: 'gases'
                }
            ],
            'false': [
                {
                    type: 'recommendation',
                    recommendation: [
                        'j55',
                        'n80',
                        'l80',
                        'c90',
                        'c95',
                        'p110',
                        'q125',
                        'rec'
                    ]
                }
            ]
        }
    },
    {
        name: 'water_cut_2',
        text: 'Corte de Agua > 30%',
        type: 'boolean',
        actions: {
            'true': [
                {
                    type: 'question',
                    name: 'gases'
                }
            ],
            'false': [
                {
                    type: 'recommendation',
                    recommendation: [
                        'j55',
                        'n80',
                        'l80',
                        'c90',
                        'c95',
                        'p110',
                        'q125',
                        'rec'
                    ]
                }
            ]
        }
    },
    {
        name: 'gases',
        text: '¿Gases Presentes?',
        type: 'boolean',
        actions: {
            'true': [
                {
                    type: 'question',
                    name: 'which_gases',
                }
            ],
            'false': [

            ]
        }
    },
    {
        name: 'which_gases',
        text: '¿Cuales gases?',
        type: 'multi',
        options: [
            {
                name: 'co2',
                text: 'CO2'
            },
            {
                name: 'h2s',
                text: 'H2S'
            },
            {
                name: 'co2_h2s',
                text: 'CO2 y H2S'
            }
        ],
        actions: {
            'co2': [{
                'type': 'question',
                'name': 'ask_ph'
            }],
            'h2s': [{
                'type': 'question',
                'name': 'zone'
            }, {
                'type': 'recommendation',
                recommendation: ['iso']
            }],
            'co2_h2s': [{
                'type': 'question',
                'name': 'zone_2'
            }]
        }
    },
    {
        name: 'ask_ph',
        type: 'multiquestion',
        questions: [
            'p_co2',
            'alk',
            'bht',
            'bhp',
            'i'
        ],
        'processing': function([pCO2, alk, bht, bhp, i]) {
            const ph = - Math.log10(pCO2/alk) + 8.68
                       + 4.05e-3 * bht + 4.58e-7 * (bht*bht)
                       - 3.07e-5 * bhp - 0.477 * Math.sqrt(i)
                       + 0.19301 * i
            intermediate('ph', 'pH', ph, '/images/formula-ph-co2.png')
            if (isNaN(ph)) return 'none'
            return ph >= 6 ? 'ph>=6' : (ph >= 5 ? 'ph>=5': 'ph<5')
        },
        actions: {
            'ph>=6': [{
                'type': 'recommendation',
                'recommendation': ['cr1']
            }],
            'ph>=5': [{
                'type': 'question',
                'name': 't>80'
            }],
            'ph<5': [{
                'type': 'question',
                'name': 't>140'
            }]
        }
    },
    {
        'name': 'p_co2',
        'text': 'Presión Parcial de CO2 (psi)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'alk',
        'text': 'Alcalinidad (mol/L), concentración de Bicarbonato',
        'type': 'numeric',
        'precision': 4,
        'actions': {}
    },
    {
        'name': 'bht',
        'text': 'Temperatura Máxima en Fondo (°F)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'bhp',
        'text': 'Presion en Fondo (psi)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'i',
        'text': 'Fuerza Ionica (mol/L), concentración de iones disueltos',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 't>80',
        'text': 'T>80°C',
        'type': 'boolean',
        'actions': {
            'true':[{
                'type': 'recommendation',
                'recommendation': ['cr3']
            }],
            'false': [{
                'type': 'question',
                'name': 'vf>vc'
            }]
        }
    },
    {
        'name': 't>140',
        'text': 'T>140°C',
        'type': 'boolean',
        'actions': {
            'true': [{
                'type': 'recommendation',
                'recommendation': ['sCr13']
            }],
            'false': [{
                'type': 'recommendation',
                'recommendation': ['cr13']
            }],
        }
    },
    {
        'name': 'vf>vc',
        'type': 'multiquestion',
        'questions': [
            'qo',
            'qw',
            'qg',
            'api',
            'rhoW',
            'rhoG',
            'muO',
            'muW',
            'muG',
            'sigmaO',
            'sigmaW',
            'id'
        ],
        'processing': vf_vc,
        actions: {
            'true': [{
                'type': 'recommendation',
                'recommendation': ['cr9', 'rec']
            }],
            'false': [{
                'type': 'recommendation',
                'recommendation': ['cr5']
            }],
        }
    },
    {
        'name': 'qo',
        'text': 'Caudal de Petróleo (Bls/dia)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'qw',
        'text': 'Caudal de Agua (Bls/dia)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'qg',
        'text': 'Caudal de Gas (SCF/dia)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'api',
        'text': 'API (°API)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'rhoW',
        'text': 'Densidad del Agua (lb/ft^3)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'rhoG',
        'text': 'Densidad del Gas (lb/ft^3)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'muO',
        'text': 'Viscosidad del Petróleo (cp)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'muW',
        'text': 'Viscosidad del Agua (cp)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'muG',
        'text': 'Viscosidad del Gas (cp)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'sigmaO',
        'text': 'Tensión Superficial del Petróleo (dina/cm)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'sigmaW',
        'text': 'Tensión Superficial del Agua (dina/cm)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'id',
        'text': 'Diametro Interno de la Tubería (in)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'zone',
        'type': 'multiquestion',
        'questions': [
            'p_h2s',
            'ph_h2s'
        ],
        'processing': function([pH2S, phH2S]) {
            // // pH calculation
            // const phData = {
            //     t20: {
            //         a: {x: 0.5527, y: 5.01347},
            //         b: {x: 25880.4, y: 2.70071},
            //     },
            //     t100: {
            //         a: {x: 0.894044, y: 5.11523},
            //         b: {x: 38681.7, y: 2.79199},
            //     }
            // }
            // const { t20, t100 } = phData
            const log = v => Math.log10(v)
            // const interpolate = (x, {x:x1, y:y1}, {x:x2, y:y2}) =>
            //     y1 + (y2 - y1) * (x - x1) / (x2 - x1)
            //
            // const pH2Skpa = pH2S * 6.89476
            // intermediate('pH2Skpa', 'Presión Parcial de H2S (kPa)', pH2Skpa)
            // const pct20 = log(pH2Skpa / t20.a.x) / log(t20.b.x / t20.a.x)
            // const ph20 = t20.a.y + (t20.b.y - t20.a.y) * pct20
            // // Use pct for both calculations to get that slanted interpolation
            // const ph100 = t100.a.y + (t100.b.y - t100.a.y) * pct20
            // const ph = interpolate(t, {x: 20, y: ph20}, {x: 100, y: ph100})

            const ph = phH2S
            // intermediate('ph', 'pH', ph, '/images/graph-ph-h2s.png')
            if (isNaN(ph) || ph > 6.5 || ph < 2.5) return 'ph_out'
            if (isNaN(pH2S) || pH2S > 150 || pH2S < 0) return 'p_h2s_out'

            const image = '/images/graph-zone.png'
            // zone 0
            if (pH2S <= 0.05){
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 0', image)
                return 'zone0'
            }

            // utility function
            // http://stackoverflow.com/a/2049593/4992717
            const checkInTriangle = (point, [v1, v2, v3]) => {
                const sign = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)

                const b1 = sign(point, v1, v2) < 0.0
                const b2 = sign(point, v2, v3) < 0.0
                const b3 = sign(point, v3, v1) < 0.0

                return ((b1 === b2) && (b2 === b3))
            }

            // zone 1
            const zone1Triangle = [
                {x: log(0.05), y: 6.5},
                {x: log(15), y: 6.5},
                {x: log(0.05), y: 4}
            ]
            if (checkInTriangle({x: log(pH2S), y: ph}, zone1Triangle)) {
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 1', image)
                return 'zone1'
            }

            // zone 3
            if (ph <= 3.5 || (ph <= 5.5 && pH2S >= 15)) {
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 3', image)
                return 'zone3'
            }
            const zone3Triangle = [
                {x: log(15), y: 5.5},
                {x: log(15), y: 3.5},
                {x: log(0.15), y: 3.5}
            ]
            if (checkInTriangle({x: log(pH2S), y: ph}, zone3Triangle)) {
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 3', image)
                return 'zone3'
            }

            // zone 2
            // Everything else was discarded, zone 2 is the only option
            intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 2', image)
            return 'zone2'

        },
        'actions': {
            'ph_out': [{
                'type': 'recommendation',
                'recommendation': 'El ph se sale del rango 2.5 - 6.5'
            }],
            'p_h2s_out': [{
                'type': 'recommendation',
                'recommendation': 'El pH2S se sale del rango 0 - 150 psi'
            }],
            'zone0': [{
                'type': 'recommendation',
                'recommendation': [
                    'j55',
                    'n80',
                    'l80',
                    'l809',
                    'l8013',
                    'c90',
                    'c95',
                    'p110',
                    'q125'
                ]
            }],
            'zone1': [{
                'type': 'recommendation',
                'recommendation': [
                    'j55',
                    'n80',
                    'l80',
                    'l809',
                    'l8013',
                    'c90',
                    't95'
                ]
            }],
            'zone2': [{
                'type': 'recommendation',
                'recommendation': ['l80', 'l809', 'l8013']
            }],
            'zone3': [{
                'type': 'recommendation',
                'recommendation': 'Grados de propietario según recomendaciones'
            }]
        }
    },
    {
        'name': 'p_h2s',
        'text': 'Presión Parcial de H2S (psi)',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'ph_h2s',
        'text':'pH del H2S',
        'type': 'numeric',
        'actions': {}
    },
    {
        'name': 'zone_2',
        'type': 'multiquestion',
        'questions': [
            'p_h2s',
            'p_co2'
        ],
        'processing': function([pH2S_psi, pCO2_psi]){
            const pH2S = pH2S_psi / 14.7
            intermediate('pH2S_atm', 'Presión Parcial de H2S (atm)', pH2S)

            const pCO2 = pCO2_psi / 14.7
            intermediate('pCO2_atm', 'Presión Parcial de CO2 (atm)', pCO2)

            const zones = {
                a: { minx: 9.08E-05,   maxx: 0.00293134, miny: 9.03E-05, maxy: 0.205259, name: 'zoneA', showName: 'Zona A'},
                b: { minx: 0.00293134, maxx: 9206.02,    miny: 9.03E-05, maxy: 0.205259, name: 'zoneB', showName: 'Zona B'},
                c: { minx: 9.08E-05,   maxx: 0.00293134, miny: 0.205259, maxy: 9367.18,  name: 'zoneC', showName: 'Zona C'},
                d: { minx: 0.00293134, maxx: 0.0283202,  miny: 0.205259, maxy: 9367.18,  name: 'zoneD', showName: 'Zona D'},
                e: {                                                                     name: 'zoneE', showName: 'Zona E'},
                f: { minx: 0.871204,   maxx: 9206.02,    miny: 0.205259, maxy: 9367.18,  name: 'zoneF', showName: 'Zona F'},
                all: { minx: 9.08E-05, maxx: 9206.02,    miny: 9.03E-05, maxy: 9367.18},
            }
            function isInZone({x, y}, name) {
                const { minx, maxx, miny, maxy } = zones[name]
                return x >= minx && x < maxx && y >= miny && y < maxy
            }
            const p = {x: pH2S, y: pCO2}
            const check = z => isInZone(p, z)

            let res = 'e'
            if (check('a')) res = 'a'
            if (check('b')) res = 'b'
            if (check('c')) res = 'c'
            if (check('d')) res = 'd'
            if (check('f')) res = 'f'
            if (!check('all')) res = 'none'

            const image = '/images/graph-zone-2.png'

            if (res === 'none') {
                intermediate('zone_2', 'Gráfica Presencia de Ambos Gases', 'Fuera de Rango', image)
                return 'none'
            }

            intermediate('zone_2', 'Gráfica Presencia de Ambos Gases', zones[res].showName, image)
            return zones[res].name
        },
        'actions': {
            zoneA: [{
                type: 'recommendation',
                recommendation: ['j55', 'n80', 'p110', 'q125']
            }],
            zoneB: [{
                type: 'recommendation',
                recommendation: ['l80', 'c90', 't95']
            }],
            zoneC: [{
                type: 'recommendation',
                recommendation: ['cr13']
            }],
            zoneD: [{
                type: 'recommendation',
                recommendation: ['sCr13']
            }],
            zoneE: [{
                type: 'recommendation',
                recommendation: ['cr22', 'cr25']
            }],
            zoneF: [{
                type: 'recommendation',
                recommendation: 'Aleaciones de Niquel'
            }]
        }
    }
]

const recommendations = {
    l80: {name: 'L80', pipe: true},
    l809: {name: 'L80 9', pipe: true},
    l8013: {name: 'L80 13', pipe: true},
    cr13: {name: '13% Cr', pipe: true},
    t95: {name: 'T95', pipe: true},
    p110: {name: 'P110', pipe: true},
    sCr13: {name: 'S 13% Cr', pipe: true},
    cr22: {name: '22% Cr', pipe: true},
    cr25: {name: '25% Cr', pipe: true},
    cr1: {name: '1% Cr', pipe: true},
    cr9: {name: '9% Cr', pipe: true},
    cr3: {name: '3% Cr', pipe: true},
    cr5: {name: '5% Cr', pipe: true},
    j55: {name: 'J55', pipe: true},
    n80: {name: 'N80', pipe: true},
    c90: {name: 'C90', pipe: true},
    c95: {name: 'C95', pipe: true},
    q125: {name: 'Q125', pipe: true},
    rec: {name: <a href="/tuberias/recubrimientos">Recubrimientos</a>, pipe: false},
    iso: {name: <a href="/files/ISO-15156-2-2015-D.pdf" target="_blank">Revisar las condiciones de la quimica del agua para elegir la gráfica correspondiente para hallar el valor del pH.</a>, pipe:false}
}

return {questions, recommendations}

}
