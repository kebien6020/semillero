import vf_vc_temp from './pipe_matrix_vf_vc.js'

export default function questions(intermediate) {

// eslint-disable-next-line indent
const vf_vc = vf_vc_temp(intermediate)
// eslint-disable-next-line indent
return [
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
                    recommendation: 'J55-N80-L80-C90-C95-P110-Q125 + notes'
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
                    recommendation: 'J55-N80-L80-C90-C95-P110-Q125 + notes'
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
            intermediate('ph', 'PH', ph)
            if (isNaN(ph)) return 'none'
            return ph >= 6 ? 'ph>=6' : (ph >= 5 ? 'ph>=5': 'ph<5')
        },
        actions: {
            'ph>=6': [{
                'type': 'recommendation',
                'recommendation': '1% Cr'
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
        'text': 'Alcalinidad (mol/L)',
        'type': 'numeric',
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
        'text': 'Fuerza Ionica (mol/L)',
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
                'recommendation': '3% Cr'
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
                'recommendation': 'S 13% Cr'
            }],
            'false': [{
                'type': 'recommendation',
                'recommendation': '13% Cr'
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
                'recommendation': '5% Cr'
            }],
            'false': [{
                'type': 'recommendation',
                'recommendation': '9% Cr'
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
            'alk',
            'bht',
            'bhp',
            'i',
            'p_h2s'
        ],
        'processing': function([alk, bht, bhp, i, pH2S]) {
            const ph = - Math.log10(pH2S/alk) + 8.68
                       + 4.05e-3 * bht + 4.58e-7 * (bht*bht)
                       - 3.07e-5 * bhp - 0.477 * Math.sqrt(i)
                       + 0.19301 * i
            intermediate('ph', 'PH', ph)
            if (isNaN(ph) || ph > 6.5 || ph < 2.5) return 'none'
            if (isNaN(pH2S) || pH2S > 150 || pH2S < 0) return 'none'

            // zone 0
            if (pH2S <= 0.05){
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 0')
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
            const log = v => Math.log10(v)

            // zone 1
            const zone1Triangle = [
                {x: log(0.05), y: 6.5},
                {x: log(15), y: 6.5},
                {x: log(0.05), y: 4}
            ]
            if (checkInTriangle({x: log(pH2S), y: ph}, zone1Triangle)) {
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 1')
                return 'zone1'
            }

            // zone 3
            if (ph <= 3.5 || (ph <= 5.5 && pH2S >= 15)) {
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 3')
                return 'zone3'
            }
            const zone3Triangle = [
                {x: log(15), y: 5.5},
                {x: log(15), y: 3.5},
                {x: log(0.15), y: 3.5}
            ]
            if (checkInTriangle({x: log(pH2S), y: ph}, zone3Triangle)) {
                intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 3')
                return 'zone3'
            }

            // zone 2
            // Everything else was discarded, zone 2 is the only option
            intermediate('zone', 'Gráfica Presencia de H2S', 'Zona 2')
            return 'zone2'

        },
        'actions': {
            'none': [{
                'type': 'recommendation',
                'recommendation': 'El ph calculado se sale del rango 2.5 - 6.5'
            }],
            'zone0': [{
                'type': 'recommendation',
                'recommendation': 'J55 - N80 - L80 - C90 - C95 - P110 - Q125'
            }],
            'zone1': [{
                'type': 'recommendation',
                'recommendation': 'J55 - N80 - L80 - L80 9 - C90 - T95 - Q125'
            }],
            'zone2': [{
                'type': 'recommendation',
                'recommendation': 'J55 - N80 - L80 - L80 9 - C90 - T95 - Q125'
            }],
            'zone3': [{
                'type': 'recommendation',
                'recommendation': 'C90 - T95'
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

            if (res === 'none') {
                intermediate('zone_2', 'Gráfica Presencia de Ambos Gases', 'Fuera de Rango')
                return 'none'
            }

            intermediate('zone_2', 'Gráfica Presencia de Ambos Gases', zones[res].showName)
            return zones[res].name
        },
        'actions': {
            zoneA: [{
                type: 'recommendation',
                recommendation: 'J55 - N80 - P110 - Q125'
            }],
            zoneB: [{
                type: 'recommendation',
                recommendation: 'L80 - C90 - T95'
            }],
            zoneC: [{
                type: 'recommendation',
                recommendation: '13% Cr'
            }],
            zoneD: [{
                type: 'recommendation',
                recommendation: 'S 13% Cr'
            }],
            zoneE: [{
                type: 'recommendation',
                recommendation: '22% Cr – 25% Cr'
            }],
            zoneF: [{
                type: 'recommendation',
                recommendation: 'Aleaciones de Niquel'
            }]
        }
    }
]

}
