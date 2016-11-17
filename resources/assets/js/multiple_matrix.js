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
        text: '¿Hay una diferencia mayor de 6 Darcies entre las formaciones?',
        description: 'Considere que este parámetro es muy relativo, y no reemplaza ningún valor de campo, depende de la máxima diferencia de permeabilidades entre las formaciones productoras del campo.',
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
        text: '¿Las capas productoras se encuentran divididas por barreras de muy baja permeabilidad de al menos 3 ft?',
        description: 'Se  consideran discontinuidades, arcillas, shales o arenas de muy baja permeabilidad como barreras, considere también la continuidad de la barrera que permita que hayan dos estratos de diferentes  características petrofísicas y de fluido a lo largo del yacimiento que no permitan que se crucen los fluidos detrás de la cara del pozo, el valor mínimo estimado para crear esa separación litológica es de 3 ft.',
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
        text: '¿Acorde a las facilidades y la tasa de retorno es factible la instalación de un completamiento múltiple?',
        type: 'boolean',
        default: true,
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
        text: '¿Una o mas capas productoras depletaron o entraron en irrupción de agua y gas?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 3,
                answer: true
            }
        ],
        recommend: {},
    },
    // 5
    {
        text: '¿Acorde a la conectividad del yacimiento las capas depletadas son candidatas a inyección para recobro o disposal?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 4,
                answer: true
            }
        ],
        recommend: {
            'true': ['parallelInyProd']
        },
    },
    // 6
    {
        text: 'Se definió tipo de pozo',
        type: 'multi',
        options: [
            'Inyector',
            'Productor'
        ],
        default: 'Productor',
        prereq: [
            {
                id: 4,
                answer: false,
            },
            {
                id: 5,
                answer: false,
            }
        ],
        recommend: {},
    },
    // 7
    {
        text: '¿Espaciamiento entre arenas es menor a 60 pies?',
        description: 'Considere que este criterio ha sido seleccionado  con base en las longitudes mínimas de las siguientes herramientas de completamiento para la inyección selectiva: Empaque, Pup Joint, Mandril de Inyección, Pup Joint y Empaque.',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 6,
                answer: 'Inyector',
            }
        ],
        recommend: {
            'false': ['directIny'],
            'true': ['vrf'],
        },
    },
    // 8
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
                id: 6,
                answer: 'Productor',
            }
        ],
        recommend: {}
    },
    // 9
    {
        text: '¿Requiere fiscalizar las zonas de forma simultanea e independiente?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 8,
                answer: 'Vertical o Desviado',
            },
        ],
        recommend: {
            'true': ['parallel', 'dualBes', 'dualGl'],
        }
    },
    // 10
    {
        text: '¿Desea tener control de reservas y retrasar frentes de agua de forma simultanea en todas las zonas?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 9,
                answer: false,
            }
        ],
        recommend: {
            'false': ['ssd'],
        }
    },
    // 11
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
                id: 8,
                answer: 'Horizontal o Multilateral'
            },
            {
                id: 10,
                answer: true
            },
        ],
        recommend: {
            'Hueco Abierto/Gravel Pack': ['icd']
        },
    },
    // 12
    {
        text: '¿Se espera intrusión de agua?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 11,
                answer: 'Hueco Abierto/Gravel Pack'
            }
        ],
        recommend: {
            'false': ['picd'],
            'true': ['aicd']
        }
    },
    // 13
    {
        text: '¿Requiere futuras estimulaciones?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 11,
                answer: 'Hueco Revestido'
            },
        ],
        recommend: {
            'true': ['ssv']
        },
    },
    // 14
    {
        text: '¿Requiere evaluación independiente de cada zona?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 13,
                answer: false
            },
        ],
        recommend: {
            'true': ['ssd'],
            'false': ['icv']
        },
    },
    // 15
    {
        text: '¿Hay presencia de zonas apretadas o shales?',
        description: 'Considere que las zonas apretadas van desde una permeabilidad de 0,01mD  hasta 0,1 mD y un yacimiento Shale a partir de 0,0001 mD hasta 0,01 mD.',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 14,
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
    directIny: makeLink('iny-directa', 'Completamiento de inyección directa'),
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
        <strong>Recomendación:</strong>,  ' Si el pozo tiene una desviación mayor a 70 grados es recomendable utilizar herramientas de apertura y cierre E-Line.', <br />,
        <strong>Recomendación:</strong>,  ' Para instalar este tipo de completamiento requiere de un espesor mínimo de 45 ft de acuerdo a la longitud de cada compartimento.'
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
