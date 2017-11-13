import React, { Component } from 'react'
import Recommendations from './Recommendations.jsx'

const questions = {
    '1': {
        text: '¿Cuál es la presión promedio del yacimiento?',
        type: 'numeric',
        default: 2000,
    },
    '2': {
        text: '¿Presion en cabeza?',
        type: 'numeric',
        default: 100,
    },
    '3': {
        text: '¿Conoce cual es la longitud del intervalo a cañonear?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    '4': {
        text: '¿Longitud del intervalo a cañonear?',
        type: 'numeric',
        default: 100,
        prereq: {
            question: '3',
            answer: 'yes'
        }
    },
    '5': {
        text: '¿Cual es el rango aproximado en pies?',
        type: 'multi',
        options: {
            lt30: '<30',
            bt3060: '30 a 60',
            gt60: '>60',
        },
        default: 'bt3060',
        prereq: {
            question: '3',
            answer: 'no'
        }
    },
    '6': {
        text: '¿Conoce el ángulo formado respecto a la vertical de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    '7': {
        text: '¿Angulo formado respecto a la vertical de formación?',
        type: 'numeric',
        default: 0,
        prereq: {
            question: '6',
            answer: 'yes'
        },
    },
    '8': {
        text: '¿En que rango se encuentra según perforación?',
        type: 'multi',
        options: {
            low: 'Bajo',
            medium: 'Medio',
            high: 'Alto',
        },
        default: 'low',
        prereq: {
            question: '6',
            answer: 'no'
        },
    },
    '9': {
        text: '¿Es Obligatorio obtener una velocidadavanzada de operación (T<12 Horas) (Multizonal)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '10': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 100,
    },
    '11': {
        text: '¿Se pretende cañonear múltiples intervalos?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '12': {
        text: 'Ingrese Tasa de Productividad (%)',
        type: 'numeric',
        default: 80,
    },
    '13': {
        text: 'Ingrese Profundidad de Penetración (mm)',
        type: 'numeric',
        default: 50,
    },
    '14': {
        text: '¿Presenta la condicion: Tuberia de Produccion?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '15': {
        text: '¿Presenta la condicion: Through Tubing?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '16': {
        text: '¿Presenta la condicion: TCP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '17': {
        text: '¿Presenta la condicion: Casing Gun?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '18': {
        text: '¿Presenta la condicion: Coiled Tubing?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '19': {
        text: '¿Presenta la condicion: Revestimiento?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '20': {
        text: '¿Presenta la condicion: Reservorios Tight Gas?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '21': {
        text: '¿Presenta la condicion: Wireline?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '22': {
        text: '¿Presenta la condicion: Open-Cased Hole?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '23': {
        text: '¿Presenta la condicion: Yacimientos de Petróleo con Capa de Gas?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '24': {
        text: '¿Presenta la condicion: Ensamblaje instalado en Superficie?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    '25': {
        text: '¿Presenta la condicion: TCP con Cargas Orientadas?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
}

function makeLink(name, text) {
    return <a href={'#' + name}>{text}</a>
}

export default class NTPerforateMatrix extends Component {
    constructor() {
        super()
        const questionValues = {}
        for (const [name, question] of Object.entries(questions))
            questionValues[name] = question.default

        this.state = {
            questionValues
        }

        this.renderQuestion = this.renderQuestion.bind(this)
        this.renderMultiQuestion = this.renderMultiQuestion.bind(this)
        this.renderNumericQuestion = this.renderNumericQuestion.bind(this)
        this.change = this.change.bind(this)
    }

    change(value, name) {
        const { state } = this
        state.questionValues[name] = value
        this.setState(state)
    }

    renderMultiQuestion(question, name, answer) {
        return (
            <select value={answer} onChange={e => this.change(e.target.value, name)}>
                {Object.entries(question.options).map(([opName, text]) =>
                    <option value={opName}>{text}</option>
                )}
            </select>
        )
    }

    renderNumericQuestion(question, name, answer) {
        return (
            <input
                type='number'
                value={answer}
                onChange={e => this.change(e.target.value, name)}
            />
        )
    }

    makePretty(input, question, name) {
        return (
            <div key={name}>
                <label htmlFor={question.name}>{question.text}</label>
                <span>{input}</span>
            </div>
        )
    }

    renderQuestion([name, question]) {
        const { state } = this
        const answer = state.questionValues[name]
        let input = null
        switch (question.type) {
        case 'multi':
            input = this.renderMultiQuestion(question, name, answer)
            break
        case 'numeric':
            input = this.renderNumericQuestion(question, name, answer)
            break
        default:
            throw Error('Unkown type of question: ' + question.type)
        }
        return this.makePretty(input, question)
    }

    render() {
        const { state } = this
        const shouldBeShown = ([, question]) => {
            if (!question.prereq) return true
            const prereqQuestion = question.prereq.question
            const answerShouldBe = question.prereq.answer
            const answerIs = state.questionValues[prereqQuestion]

            return answerShouldBe === answerIs
        }
        const shownQuestions = Object.entries(questions).filter(shouldBeShown)

        return (
            <div>
                <form>
                    {shownQuestions.map(this.renderQuestion)}
                </form>
                <Recommendations recommendations={[
                    makeLink('stimtube', 'Tecnología Stimtube'),
                    makeLink('powr-perf', 'Tecnología POWR/PERF'),
                    makeLink('perf-stim', 'Tecnología PerfStim'),
                    makeLink('plug-and-perf', 'Tecnología de completamiento de cañón insertable (Plug and Perf)'),
                ]}/>
            </div>
        )
    }
}
