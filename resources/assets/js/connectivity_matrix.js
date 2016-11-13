import './app'
import React from 'react'
import ReactDOM from 'react-dom'

import QuestionMatrix from './components/QuestionMatrix.jsx'

const questions = [
    // 0
    {
        text: 'Condición de presión',
        type: 'multi',
        options: [
            'Bajo balance',
            'Sobre balance',
            'Desconocida',
        ],
        default: 'Sobre balance',
        prereq: [],
        recommend: {},
    },
    // 1
    {
        text: '¿El pozo se encuentra con tubería de producción o con revestimiento?',
        type: 'multi',
        options: [
            'Tubería de producción',
            'Revestimiento',
        ],
        default: 'Revestimiento',
        prereq: [
            {
                id: 0,
                answer: 'Desconocida',
            }
        ],
        recommend: {
            'Revestimiento': ['gun'],
        }
    },
    // 2
    {
        text: '¿La sección a cañonear es de gran longitud y se requiere una densidad de disparo > 6TTP?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 0,
                answer: 'Bajo balance'
            },
        ],
        recommend: {
            'true': ['tcp', 'pure'],
            'false': ['thru', 'slickline'],
        }
    },
    // 3
    {
        text: '¿Es necesaria una velocidad de operación alta?',
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 0,
                answer: 'Sobre balance'
            },
        ],
        recommend: {
            'true': ['gun', 'extreme'],
            'false': ['thru', 'extreme'],
        }
    },
    // 4
    {
        text: ['Se tiene alguna de estas condiciones?',
            <ul key="0">
                <li>Ángulo de pozo > 60°.</li>
                <li>Requiere cañonear zonas múltiples.</li>
                <li>Densidad de disparo > 6 TTP.</li>
                <li>Cañonear zonas profundas</li>
            </ul>],
        type: 'boolean',
        default: false,
        prereq: [
            {
                id: 1,
                answer: 'Tubería de producción'
            }
        ],
        recommend: {
            'true': ['tcp', 'high'],
            'false': ['thru']
        }
    },
]

const recommendations = {
    thru: 'Through Tubing Wireline (cañoneo a través de tubería de producción bajado con línea eléctrica)',
    tcp: 'TCP (cañoneo bajado con la tubería de producción)',
    gun: 'Casing Gun Wireline (cañoneo a través de revestimiento bajado con línea eléctrica)',
    pure: 'Sugerencia: Utilizar la técnica Pure para que los perforados queden limpios, incrementar la productividad e inyectabilidad en los pozos. Además permite minimizar el daño por el cañoneo.',
    slickline: 'Sugerencia: Utilizar Slickline para poder controlar de mejor manera la presión debido a su diámetro menor.',
    extreme: 'Sugerencia: Utilizar la técnica de sobre balance extremo para minimizar el daño e incrementar la conectividad.',
    high: 'Sugerencia: Utilizar un sistema de High Shot Density (alta densidad de disparo). También se puede utilizar el método Through tubing con coiled tubing para pozos altamente desviados.',

}

ReactDOM.render(
    <QuestionMatrix
        questions={questions}
        recommendationText={recommendations}
        noRecommendations="No se recomienda completamiento múltiple"
    />,
    document.getElementById('matrix')
)
