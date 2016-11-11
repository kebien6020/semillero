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
        text: '¿Espaciamiento entre arenas es menor a __?',
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

const recommendations = {
    parallelInyProd: 'Instalar sartas paralelas inyección/producción',
    directIny: 'Completamiento de inyección directa',
    vrf: 'Completamiento de inyección selectiva con VRF',
    parallel: 'Instalar sartas paralelas',
    dualBes: 'Instalar completamiento dual concentrico BES',
    dualGl: 'Instalar completamiento dual Gas Lift',
    ssd: 'Instalar completamiento SSD',
    icd: 'Instalar completamiento ICD convencional',
    picd: 'Instalar completamiento PICD',
    aicd: 'Instalar completamiento AICD',
    ssv: 'Instalar completamiento SSV',
    icv: 'Instalar completamiento ICV',
    binaryValves: 'Instalar válvulas bianrias y de choke para ICV',
    chokeValves: 'Instalar válvulas de choke ICV',
}

ReactDOM.render(
    <QuestionMatrix
        questions={questions}
        recommendationText={recommendations}
        noRecommendations="No se recomienda completamiento múltiple"
    />,
    document.getElementById('matrix')
)
