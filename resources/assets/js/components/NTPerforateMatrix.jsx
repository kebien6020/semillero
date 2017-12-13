import React, { Component } from 'react'
import Recommendations from './Recommendations.jsx'

const questions = {
    'have-phi': {
        title: 'Matriz de Formacion',
        text: '¿Tiene el valor promedio de porosidad de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'phi': {
        text: 'Ingrese la porosidad',
        type: 'numeric',
        default: 15,
        prereq: {
            question: 'have-phi',
            answer: 'yes',
        }
    },
    'ambient': {
        text: '¿En que ambiente operacional se encuentra?',
        type: 'multi',
        options: {
            conventional: 'Convencional',
            unconventional: 'No Convencional',
        },
        default: 'conventional',
        prereq: {
            question: 'have-phi',
            answer: 'no',
        },
    },
    'reservoir': {
        text: 'Tipo de reservorio convencional',
        type: 'multi',
        options: {
            conventional: 'Completamiento convencional',
            'no-consolidated': 'Reservorios no consolidados',
            carbonate: 'Reservorios de carbonatos',
        },
        default: 'conventional',
        prereq: {
            question: 'ambient',
            answer: 'conventional',
        },
    },
    'fraq': {
        text: '¿Reservorios a fracturamiento hidráulico?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'reservoir',
            answer: 'carbonate',
        },
    },
    'multi-fraq': {
        text: '¿Reservorio a fracturamiento hidráulico multi-etapa en pozos horizontales?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'ambient',
            answer: 'unconventional',
        },
    },
    'have-ucs': {
        text: '¿Tiene el valor de UCS (Resistencia a la formación no confinada) en Psi?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'ucs': {
        text: 'Ingrese el valor de UCS en Psi',
        type: 'numeric',
        default: 3000,
        prereq: {
            question: 'have-ucs',
            answer: 'yes',
        }
    },
    'ucs-range': {
        text: '¿En que rango estimado según PVT se encuentra?',
        type: 'multi',
        options: {
            lt2200: '<2200 Psi',
            lt4900: '2200 a 4900 Psi',
            lt6500: '4900 a 6500 Psi',
            lt13000: '6500 a 13000 Psi',
            gt13000: '>13000 Psi',
        },
        default: 'lt4900',
        prereq: {
            question: 'have-ucs',
            answer: 'no',
        },
    },
    'py': {
        text: '¿Cuál es la presión promedio del yacimiento?',
        type: 'numeric',
        default: 3000,
    },
    'pc': {
        text: '¿Cuál es la presión en cabezal?',
        type: 'numeric',
        default: 200,
    },
    'type-s': {
        text: '¿Cuál es el factor de daño según el estado del pozo?',
        type: 'multi',
        options: {
            damaged: 'Pozo dañado',
            estimulated: 'Pozo estimulado',
        },
        default: 'damaged',
    },
    'damage': {
        text: '¿Altamente dañado?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'type-s',
            answer: 'damaged',
        },
    },
    'estimulation': {
        text: 'Tipo de estimulación',
        type: 'multi',
        options: {
            acid: 'Acidificación',
            hydraulic: 'F. Hidráulico',
            'massive-hidraulic': 'F. Hidráulico masivo',
        },
        default: 'acid',
        prereq: {
            question: 'type-s',
            answer: 'estimulated',
        },
    },
    'have-k': {
        text: '¿Tiene la permeabilidad promedio de la formación en miliDarcies?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'k': {
        text: 'Ingrese la permeabilidad',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-k',
            answer: 'yes',
        },
    },
    'formation-type': {
        text: '¿En qué tipo de formación se encuentra?',
        type: 'multi',
        options: {
            sand: 'Arena Consolidada',
            carbonate: 'Carbonato',
        },
        default: 'sand',
        prereq: {
            question: 'have-k',
            answer: 'no',
        },
    },
    'k-range-1': {
        text: '¿En que rango de permeabilidad se encuentra?',
        type: 'multi',
        options: {
            lt10: '< 10 mD',
            lt100: '10 mD a 100 mD',
            gt100: '> 100 mD',
        },
        default: 'lt100',
        prereq: {
            question: 'formation-type',
            answer: 'sand',
        },
    },
    'k-range-2': {
        text: '¿En que rango de permeabilidad se encuentra?',
        type: 'multi',
        options: {
            lt10: '< 10 mD',
            lt100: '10 mD a 100 mD',
            lt250: '100 mD a 250 mD',
            gt250: '> 250 mD',
        },
        default: 'lt100',
        prereq: {
            question: 'formation-type',
            answer: 'carbonate',
        },
    },
    'have-angle': {
        text: '¿Conoce el ángulo formado respecto a la vertical de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'angle': {
        text: 'Ingrese el ángulo',
        type: 'numeric',
        default: 0,
        prereq: {
            question: 'have-angle',
            answer: 'yes',
        },
    },
    'angle-range': {
        text: '¿En que rango se encuentra según perforación?',
        type: 'multi',
        options: {
            low: 'Bajo (∢0 a 5)',
            medium: 'Medio (∢5 a 20)',
            high: 'Alto (∢20 a 40)',
        },
        default: 'low',
        prereq: {
            question: 'have-angle',
            answer: 'no',
        },
    },
    'time': {
        title: 'Matriz de tipo de fluido',
        text: '¿Qué rango de tiempo en horas dispone?',
        type: 'multi',
        options: {
            lt100: '1 a 100',
            lt200: '100 a 200',
            lt300: '200 a 300',
        },
        default: 'lt200',
    },
    'have-pressure': {
        text: '¿Conoce la presión promedio en fondo de pozo (Psi)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'pressure': {
        text: 'Ingrese la presión promedio en fondo de pozo',
        type: 'numeric',
        default: 3000,
        prereq: {
            question: 'have-pressure',
            answer: 'yes',
        },
    },
    'depth-1': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 6000,
        prereq: {
            question: 'have-pressure',
            answer: 'no',
        },
    },
    'have-temperature': {
        text: '¿Conoce la temperatura en (ºF)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'temperature': {
        text: 'Ingrese la temperatura en (ºF)',
        type: 'numeric',
        default: 200,
        prereq: {
            question: 'have-temperature',
            answer: 'yes',
        },
    },
    'depth-2': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 6000,
        prereq: {
            question: 'have-temperature',
            answer: 'no',
        },
    },
    'fluid': {
        text: '¿Qué tipo de fluido tiene en yacimiento?',
        type: 'multi',
        options: {
            bifasic: 'Bifásico',
            trifasic: 'Trifásico',
        },
        default: 'bifasic',
    },
    'have-api': {
        text: '¿Conoce la gravedad API del crudo?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'api': {
        text: 'Ingrese la gravedad API del crudo',
        type: 'numeric',
        default: 20,
        prereq: {
            question: 'have-api',
            answer: 'yes',
        },
    },
    'oil-type': {
        text: '¿Qué tipo de crudo espera en superficie?',
        type: 'multi',
        options: {
            'e-heavy': 'Extrapesado (<9.9)',
            'heavy': 'Pesado (10 a 15)',
            'medium': 'Mediano (15 a 29.9)',
            'light': 'Liviano (30 a 39.9)',
            'condensed': 'Condensado (>40)',
        },
        default: 'medium',
        prereq: {
            question: 'have-api',
            answer: 'no',
        },
    },
    'have-visc-oil': {
        text: '¿Conoce la viscosidad del crudo en cP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'visc-oil': {
        text: 'Ingrese la viscosidad del crudo en cP',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-visc-oil',
            answer: 'yes',
        },
    },
    'have-salt-water': {
        text: '¿Conoce la salinidad del agua de formación (%)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'salt-water': {
        text: 'Ingrese la salinidad del agua de formación (%)',
        type: 'numeric',
        default: 15,
        prereq: {
            question: 'have-salt-water',
            answer: 'yes',
        },
    },
    'salt-water-range': {
        text: '¿Qué tipo de agua de formación según registros eléctricos tiene?',
        type: 'multi',
        options: {
            high: 'Alta resistividad (1-10%)',
            medium: 'Resistividad media (10-20%)',
            low: 'Baja resistividad (20 a 26%)',
        },
        default: 'medium',
        prereq: {
            question: 'have-salt-water',
            answer: 'no',
        },
    },
    'have-visc-water': {
        text: '¿Conoce la viscosidad del agua de formación en cP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'visc-water': {
        text: 'Ingrese la viscosidad del agua de formación en cP',
        type: 'numeric',
        default: 50,
        prereq: {
            question: 'have-visc-water',
            answer: 'yes',
        },
    },
    'saturation-gas': {
        text: 'Indique la saturación inicial de gas en el yacimiento',
        type: 'numeric',
        default: 20,
        prereq: {
            question: 'fluid',
            answer: 'trifasic',
        },
    },
    'multiple-intervals': {
        title: 'Matriz de sistema de conectividad',
        text: '¿Se pretende cañonear múltiples intervalos?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    },
    'speed': {
        text: '¿Es Obligatorio obtener una velocidad avanzada de operación (T<12 Horas) (Multizonal)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'multiple-intervals',
            answer: 'yes',
        },
    },
    'have-interval': {
        text: '¿Conoce cual es la longitud del intervalo a cañonear?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
        prereq: {
            question: 'multiple-intervals',
            answer: 'no',
        },
    },
    'interval': {
        text: 'Indicar la longitud del intervalo a cañonear',
        type: 'numeric',
        default: 45,
        prereq: {
            question: 'have-interval',
            answer: 'yes',
        },
    },
    'interval-range': {
        text: '¿Cual es el rango aproximado en pies?',
        type: 'multi',
        options: {
            lt30: '<30',
            lt60: '30 a 60',
            gt60: '>60',
        },
        default: 'lt60',
        prereq: {
            question: 'have-interval',
            answer: 'no',
        },
    },
    'have-diameter': {
        text: '¿Conoce el diámetro de perforado según la dureza de tubería?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'diameter': {
        text: 'Indicar el diámetro de perforado',
        type: 'numeric',
        default: 10,
        prereq: {
            question: 'have-diameter',
            answer: 'yes',
        },
    },
    'have-casing-id': {
        text: '¿Conoce el diámetro interno de la tubería de revestimiento?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'casing-id': {
        text: 'Indicar el diámetro interno de la tubería de revestimiento',
        type: 'numeric',
        default: 7,
        prereq: {
            question: 'have-casing-id',
            answer: 'yes',
        },
    },
    'casing-grade': {
        text: 'Indicar grado de la tubería de revestimiento',
        type: 'multi',
        options: {
            'none': 'No hay opciones',
        },
        default: 'none',
        prereq: {
            question: 'have-casing-id',
            answer: 'no',
        },
    },
    'pressure-condition': {
        text: '¿Con base al valor de presión promedio de formación, en que condición se pretende realizar la operación?',
        type: 'multi',
        options: {
            underbalance: 'Bajo-balance',
            overbalance: 'Sobre-balance',
        },
        default: 'overbalance',
    },
    'have-underbalance-pressure': {
        text: '¿Conoce el valor de bajo-balance dinámico en Psi?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
        prereq: {
            question: 'pressure-condition',
            answer: 'underbalance',
        },
    },
    'underbalance-pressure': {
        text: 'Indicar el valor de bajo-balance dinámico en Psi',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'yes',
        },
    },
    'gas-oil': {
        text: '¿Yacimiento de gas o de petróleo?',
        type: 'multi',
        options: {
            gas: 'Gas',
            oil: 'Petróleo',
        },
        default: 'oil',
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'no',
        },
    },
    'k-gas-oil': {
        text: 'Insertar valor de permeabilidad',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'no',
        },
    },
    'eob': {
        text: '¿Se pretende desarrollar EOB (Sobre-balance extremo)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
        prereq: {
            question: 'pressure-condition',
            answer: 'overbalance',
        },
    },
    'have-pr': {
        text: '¿Conoce cual es la relación de productividad esperada por el pozo?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'yes',
    },
    'pr': {
        text: 'Insertar relación de productividad esperada por el pozo',
        type: 'numeric',
        default: 1,
        prereq: {
            question: 'have-pr',
            answer: 'yes',
        },
    },
    'pr-range': {
        text: '¿En que rango se encuentra?',
        type: 'multi',
        options: {
            lt08: '0.5 a 0.8',
            lt12: '0.8 a 1.2',
            lt15: '1.2 a 1.5',
        },
        default: 'lt12',
        prereq: {
            question: 'have-pr',
            answer: 'no',
        },
    },
    'conditions': {
        text: (
            <p>
                ¿Operativamente, se tiene alguna de estas condiciones?
                <ul>
                    <li>El ensamblaje con Wireline supera el limite tensional o axial máximo</li>
                    <li>Producción H2S y/o Co2</li>
                    <li>Alta presión en cabeza</li>
                </ul>
            </p>
        ),
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No',
        },
        default: 'no',
    }
}

class NumericInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showText: String(props.value)
        }
    }
    render() {
        const isNumeric = n => !isNaN(Number(n))
        // Handle automatic reuse of components
        const showText = Number(this.state.showText) === this.props.value
            ? this.state.showText
            : String(this.props.value)
        return (
            <input
                type='text'
                value={showText}
                onChange={e => {
                    let val = e.target.value
                    val = val.replace(/,/g, '.')
                    if(isNumeric(val)) {
                        this.setState({showText: val})
                        return this.props.onChange(Number(val))
                    }
                }}
            />
        )
    }
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
            <NumericInput
                value={answer}
                onChange={val => this.change(val, name)}
            />
        )
    }

    makePretty(input, question, name) {
        return (
            <div key={name}>
                {question.title &&
                    <h2>{question.title}</h2>
                }
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
            const parentIsShown = shouldBeShown([null, questions[prereqQuestion]])

            return answerShouldBe === answerIs && parentIsShown
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
