import './app'
import React from 'react'
import ReactDOM from 'react-dom'

import QuestionMatrix from './components/QuestionMatrix.jsx'

const questions = [
    // 0
    {
        text: '¿Hay mas de una zona prospectiva en el pozo (inyección o producción)?',
        type: 'boolean',
        default: true,
        prereq: [],
        recommend: {},
    },
    // 1
    {
        text: '¿Existe alta diferencia de permeabilidad entre zonas?',
        type: 'boolean',
        default: true,
        prereq: [
            {
                id: 0,
                answer: true
            }
        ],
        recommend: {},
    },
    // 2
    {
        text: '¿Cuenta con las facilidades e inversion inicial para la instalación de un completamiento no convencional?',
        type: 'boolean',
        default: true,
        prereq: [
            {
                id: 1,
                answer: true
            }
        ],
        recommend: {},
    },
    // 3
    {
        text: '¿Una o mas capas productoras depletaron o entraron en irrupción de agua y gas?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 2,
                answer: true
            }
        ],
        recommend: {},
    },
    // 4
    {
        text: '¿Acorde a la conectividad del yacimiento las capas depletadas son candidatas a inyección para recobro disposal?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 3,
                answer: true
            }
        ],
        recommend: {
            'true': ['parallelInyProd']
        },
    },
    // 5
    {
        text: 'Se definió entonces que el pozo quedaría...',
        type: 'multi',
        options: [
            'Inyector',
            'Productor'
        ],
        default: 'Productor',
        prereq: [
            {
                id: 3,
                answer: false,
            },
            {
                id: 4,
                answer: false,
            }
        ],
        recommend: {},
    },
    // 6
    {
        text: '¿Espaciamiento entre arenas es menor a 60 pies?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 5,
                answer: 'Inyector',
            }
        ],
        recommend: {
            'false': ['directIny'],
            'true': ['vrf'],
        },
    },
    // 7
    {
        text: '¿Que tipo de pozo es con respecto a la geometría?',
        type: 'multi',
        options: [
            'Vertical o Desviado',
            'Horizontal o Multilateral'
        ],
        default: 'Vertical o Desviado',
        prereq: [
            {
                id: 5,
                answer: 'Productor',
            }
        ],
        recommend: {}
    },
    // 8
    {
        text: '¿Requiere fiscalizar las zonas de forma simultanea e independiente?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 7,
                answer: 'Vertical o Desviado',
            },
        ],
        recommend: {
            'true': ['parallel', 'dualBes', 'dualGl'],
        }
    },
    // 9
    {
        text: '¿Desea tener control de reservas y retrasar frentes de agua de forma simultanea en todas las zonas?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 8,
                answer: false,
            }
        ],
        recommend: {
            'false': ['ssd'],
        }
    },
    // 10
    {
        text: '¿Cuál es el tipo de completamiento utilizado en el pozo?',
        type: 'multi',
        options: [
            'Hueco Revestido',
            'Hueco Abierto/Gravel Pack'
        ],
        default: 'Hueco Abierto/Gravel Pack',
        prereq: [
            {
                id: 7,
                answer: 'Horizontal o Multilateral'
            },
            {
                id: 9,
                answer: true
            },
        ],
        recommend: {
            'Hueco Abierto/Gravel Pack': ['icd']
        },
    },
    // 11
    {
        text: '¿Se espera intrusión de agua?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 10,
                answer: 'Hueco Abierto/Gravel Pack'
            }
        ],
        recommend: {
            'false': ['picd'],
            'true': ['aicd']
        }
    },
    // 12
    {
        text: '¿Requiere futuras estimulaciones?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 10,
                answer: 'Hueco Revestido'
            },
        ],
        recommend: {
            'true': ['ssv']
        },
    },
    // 13
    {
        text: '¿Requiere evaluación independiente de cada zona?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 12,
                answer: false
            },
        ],
        recommend: {
            'true': ['ssd'],
            'false': ['icv']
        },
    },
    // 14
    {
        text: '¿Hay presencia de shales o zonas apretadas?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 13,
                answer: false,
            }
        ],
        recommend: {
            'true': ['binaryValves'],
            'false': ['chokeValves']
        }
    }
]

const makeLink = (id, text) =>
    <a href={`/multiples/matrix/explanations#${id}`}>{text}</a>

const recommendations = {
    parallelInyProd: 'Instalar sartas paralelas inyección/producción',
    directIny: 'Completamiento de inyección directa',
    vrf: [
        makeLink('vrf', 'Completamiento de inyección selectiva con VRF'), <br />, <br />,
        <strong>Nota:</strong>, ' Para este completamiento se consideraron espaciamientos mínimos de arenas con respecto a los datos adquiridos de completamientos de inyección selectiva en cargados en OpenWells', <span>&reg;</span>
    ],
    parallel: [
        'Instalar sartas paralelas', <br />, <br />,
        <strong>Nota:</strong>, ' Si el pozo produce por flujo natural considere el completamiento de sartas paralelas para la producción de las dos zonas, de lo contrario consultar la matriz de selección preliminar de los sistemas de levantamiento artificial, si resulta que su pozo es un candidato para BES considere instalar el sistema Dual Concéntrico BES. Si resulta que su pozo es un candidato para gas lift considere instalar el sistema de gas lift dual.'
    ],
    dualBes: [
        makeLink('dual-bes', 'Instalar completamiento dual concéntrico BES.'), <br />, <br />,
        <strong>Nota:</strong>, ' Tenga en cuenta los siguientes rangos de aplicación:',
        <ul>
            <li>Angulo máximo de desviación de 45º</li>
            <li>Dog Leg menor a 8º/100fT</li>
            <li>Diámetro mínimo de revestimiento 9 5/8”</li>
            <li>Tubería de producción con un diámetro mínimo de 7”</li>
            <li>Relación Gas-Petróleo no mayor al 10%</li>
            <li>Espaciamiento entre las arenas mínimo de 100 ft</li>
        </ul>
    ],
    dualGl: [
        'Instalar completamiento dual Gas Lift', <br />, <br />,
        <strong>Nota:</strong>, ' Tenga en cuenta los siguientes rangos de aplicación:',
        <ul>
            <li>Diámetros mínimos de 9 5/8” y para la zona de interés un diámetro de 7”</li>
            <li>Tubería de producción de 2 7/8”</li>
            <li>Este diseño puede completarse con métodos para control de arena</li>
        </ul>
    ],
    ssd: [
        makeLink('ssd', 'Instalar completamiento SSD.'), <br />, <br />,
        <strong>Nota:</strong>, ' La producción selectiva o secuencial permite la evaluación de zonas por medio de la producción secuencial de las mismas, sin embargo es posible producir más de una zona al tiempo.', <br />,
        <strong>Recomendación:</strong>,  ' Si el pozo tiene una desviación mayor a 70 grados es recomendable utilizar herramientas de apertura y cierre E-Line.'
    ],
    icd: makeLink('picd-aicd', 'Instalar completamiento ICD convencional'),
    picd: makeLink('picd-aicd', 'Instalar completamiento PICD'),
    aicd: makeLink('picd-aicd', 'Instalar completamiento AICD'),
    ssv: makeLink('icv', 'Instalar completamiento SSV'),
    icv: makeLink('icv', 'Instalar completamiento ICV'),
    binaryValves: <ul><li>Instalar válvulas bianrias y de choke para ICV</li></ul>,
    chokeValves: <ul><li>Instalar válvulas de choke ICV</li></ul>,
}

ReactDOM.render(
    <QuestionMatrix
        questions={questions}
        recommendationText={recommendations}
        noRecommendations="No se recomienda completamiento múltiple"
    />,
    document.getElementById('matrix')
)
