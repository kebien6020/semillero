import React, { Component } from 'react'
import NumericInput from 'react-numeric-input'

import questions from './pipe_burst_questions.js'
import burstTables from './pipe_burst_data.js'

const tubingTables = {
    l80: ['api80'],
    l809: ['api80'],
    l8013: ['cra80'],
    cr13: ['cra80', 'cra95', 'cra110'],
    t95: ['api95'],
    p110: ['api110'],
    sCr13: ['cra80', 'cra95', 'cra110', 'cra125'],
    cr22: ['cra110', 'cra125', 'cra140'],
    cr25: ['cra80', 'cra110', 'cra125', 'cra140'],
    cr1: ['api90', 'api95'],
    cr9: ['api80'],
    cr3: ['api80', 'api95', 'api110'],
    cr5: ['api80', 'api95', 'api110'],
    j55: ['api55'],
    n80: ['api80'],
    c90: ['api90'],
    c95: ['api95'],
    q125: ['api125'],
}

const tableShowName = {
    api55: 'API 55',
    api80: 'API 80',
    api90: 'API 90',
    api95: 'API 95',
    api110: 'API 110',
    api125: 'API 125',
    cra80: 'CRA 80',
    cra95: 'CRA 95',
    cra110: 'CRA 110',
    cra125: 'CRA 125',
    cra140: 'CRA 140',
}

export default class PipeMatrix extends Component {

    constructor(props) {
        super(props)
        this.state = {
            answers: {
                // 'hGasket': 9000,
                // 'hBrine': 3000,
                // 'tvd': 10000,
                // 'p': 10000,
                // 'rhoBrine': 12,
                // 'id': 3.958,
                // 'od': 4.5,
                // 'api': 28,
                // 'waterCut': 0.4,
                // 'rhoW': 8.33,
                // 'gasGradient': 28,
                'grade': props.grade || 'l80',
                'systemType': props.systemType || 'liq',
                'h_gasket': null,
                'h_brine': null,
                'tvd': null,
                'p': null,
                'rho_brine': null,
                'id': null,
                'od': null,
                'API': null,
                'W.C': null,
                'rho_water': null,
            },
            showProcedure: true,
        }

        // Bind `this` to methods
        ;[
            'renderQuestion',
            'renderStep',
            'handleAnswer',
            'handleProcedureClick',
            'processBase',
            'processFullEvacuation'
        ].forEach(fName => this[fName] = this[fName].bind(this))
    }

    handleAnswer(question, answer) {
        this.setState (state => {
            state.answers[question.name] = answer
            return state
        })
    }

    handleProcedureClick() {
        this.setState(state => {
            state.showProcedure = !state.showProcedure
            return state
        })
    }

    renderQuestion(question, i) {
        if (question.type === 'multi') {
            const $opts = question.options.map((option, j) =>
                <option value={option.name} key={j}>{option.text}</option>
            )
            return (
                <div className="my-form-group" key={i}>
                    <label htmlFor={question.name}>{question.text}</label>
                    <span><select
                        id={question.name}
                        value={this.state.answers[question.name]}
                        onChange={(ev) => this.handleAnswer(question, ev.target.value)}>
                        {$opts}
                    </select></span>
                </div>
            )
        } else if (question.type === 'boolean') {
            return (
                <div className="my-form-group" key={i}>
                    <span><input
                        type="checkbox"
                        id={question.name}
                        onChange={(ev) => this.handleAnswer(question, ev.target.checked)}
                    /></span>
                    <label htmlFor={question.name}>{question.text}</label>
                </div>
            )
        } else if (question.type === 'numeric') {
            return (
                <div className="my-form-group" key={i}>
                    <label htmlFor={question.name}>{question.text}</label>
                    <NumericInput
                        id={question.name}
                        precision={question.precision !== undefined ? question.precision : 2}
                        value={this.state.answers[question.name]}
                        style={false}
                        onChange={num => this.handleAnswer(question, num)} />
                </div>
            )
        }
    }

    renderStep(step, i) {
        const img = step.image
                 && <div>
                        <p>Leido/calculado de:</p>
                        <img src={step.image} alt={'Gráfica: ' + step.showName} />
                    </div>
        if (typeof step.value === 'number' && isNaN(step.value))
            return null
        return (
            <div key={i}>
                <strong>{step.showName}: </strong>
                {step.value}
                {img}
            </div>
        )
    }

    findNearest(intermediate, grade, load, id, od, searchField = 'burst', ratio = 1.15) {
        // Utility function
        const flatmap = (arr, cb) => [].concat(...arr.map(cb))
        // Tables we need to compare against
        const tables = tubingTables[grade]
        // Unify all the tables but preserve the table name in all rows
        const masterTable = flatmap(tables, tName => burstTables[tName].map(row => {
            row['tName'] = tName
            return row
        }))
        // Filter all in which load/searchField is greater than ratio
        // Filter only the ones in which id and od matches
        const filtered = masterTable
            .filter(row => row[searchField] / load > ratio)
            .filter(row => row.id === id && row.od === od)
        // Return the best 2, with lowest searchField
        const ans = filtered.sort((a, b) => a[searchField] - b[searchField]).slice(0, 2)
        const ansName = 'Mejores valores de carga/' + (searchField === 'burst' ? 'P estallido': 'P colapso')
        intermediate(ansName, JSON.stringify(ans.map(row => row[searchField] / load), null, 2))
        return ans
    }

    processBase({ p, tvd, rhoW, waterCut, api, hGasket, rhoBrine, grade, id, od }) {
        const intermediateSteps = []
        const intermediate = (showName, value, image = null) => {
            intermediateSteps.push({
                showName,
                value,
                image
            })
        }

        const specificGravityO = (141.5 / (api + 131.5))
        intermediate('Gravedad Específica del Petróleo', specificGravityO)
        const rhoO = specificGravityO * rhoW
        intermediate('Densidad del Petróleo (ppg)', rhoO)
        const p1in = p - 0.052 * tvd * (rhoW * waterCut + rhoO * (1 - waterCut))
        intermediate('Punto 1 - P in (psi)', p1in)
        const deltaP1 = p1in
        intermediate('∆P1 (psi)', deltaP1)
        const p2in = p - 0.052 * (tvd - hGasket) * (rhoW * waterCut + rhoO * (1 - waterCut))
        intermediate('Punto 2 - P in (psi)', p2in)
        const p2out = 0.052 * rhoBrine * hGasket
        intermediate('Punto 2 - P out (psi)', p2out)
        const deltaP2 = p2in - p2out
        intermediate('∆P2 (psi)', deltaP2)
        const load = Math.max(deltaP1, deltaP2)
        intermediate('∆P máximo (psi)', load)

        const recommendations = this.findNearest(intermediate, grade, load, id, od)

        return { recommendations, intermediateSteps }
    }

    processFullEvacuation({rhoBrine, hGasket, grade, id, od}) {
        const intermediateSteps = []
        const intermediate = (showName, value, image = null) => {
            intermediateSteps.push({
                showName,
                value,
                image
            })
        }

        const deltaP1 = 0
        intermediate('∆P1 (psi)', deltaP1)
        const p2out = 0.052 * rhoBrine * hGasket
        intermediate('Punto 2 - P out (psi)', p2out)
        const deltaP2 = Math.abs(0 - p2out)
        intermediate('∆P2 (psi)', deltaP2)
        const load = Math.max(deltaP1, deltaP2)
        intermediate('∆P máximo (psi)', load)

        const recommendations = this.findNearest(intermediate, grade, load, id, od, 'collapse', 1.125)
        return { recommendations, intermediateSteps }
    }

    processGas({p, gasGradient, tvd, hGasket, rhoBrine, grade, id, od}) {
        const intermediateSteps = []
        const intermediate = (showName, value, image = null) => {
            intermediateSteps.push({
                showName,
                value,
                image
            })
        }

        const p1in = p - gasGradient * tvd
        intermediate('Punto 1 - P in (psi)', p1in)
        const deltaP1 = Math.abs(p1in - 0)
        intermediate('∆P1 (psi)', deltaP1)
        const p2in = p - gasGradient * (tvd - hGasket)
        intermediate('Punto 2 - P in (psi)', p2in)
        const p2out = 0.052 * rhoBrine * (tvd - hGasket)
        intermediate('Punto 2 - P out (psi)', p2out)
        const deltaP2 = Math.abs(p2in - p2out)
        intermediate('∆P2 (psi)', deltaP2)
        const load = Math.max(deltaP1, deltaP2)
        intermediate('∆P máximo (psi)', load)

        const recommendations = this.findNearest(intermediate, grade, load, id, od)
        return { recommendations, intermediateSteps }
    }

    renderRecommendation(rec, i) {
        const fix3 = n => n.toFixed(3)
        return (
            <tr key={i}>
                <td>{tableShowName[rec.tName]}</td>
                <td>{rec.name}</td>
                <td>{rec.name2}</td>
                <td>{rec.od}</td>
                <td>{fix3((rec.od - rec.id) / 2)}</td>
                <td>{rec.id}</td>
                <td>{rec.burst}</td>
                <td>{rec.collapse}</td>
            </tr>
        )
    }

    // # Main render
    render() {
        const $questions = questions.filter(q => q.show ? q.show(this.state): true).map(this.renderQuestion)

        const gas = this.state.answers.systemType === 'gc'

        const { recommendations: baseRecommendations, intermediateSteps: baseSteps } = this.processBase(this.state.answers)
        const { recommendations: fullEvacRecommendations, intermediateSteps: fullEvacSteps } = this.processFullEvacuation(this.state.answers)
        const { recommendations: gasRecommendations, intermediateSteps: gasSteps } = this.processGas(this.state.answers)

        const $baseRecommendations = baseRecommendations.map(this.renderRecommendation)
        const $fullEvacRecommendations = fullEvacRecommendations.map(this.renderRecommendation)
        const $gasRecommendations = gasRecommendations.map(this.renderRecommendation)

        const allSteps = gas ?
                         baseSteps.concat(gasSteps)
                       : baseSteps.concat(fullEvacSteps)

        const $steps = allSteps.map(this.renderStep)
        const makeTable = $rec => (
            <table>
                <thead>
                    <tr>
                        <th>Tabla</th>
                        <th>Etiqueta 1</th>
                        <th>Etiqueta 2</th>
                        <th>Diametro Externo (pulg)</th>
                        <th>Espesor de Pared (pulg)</th>
                        <th>Diametro Interno (pulg)</th>
                        <th>Presión de Estallido (psi)</th>
                        <th>Presión de Colapso (psi)</th>
                    </tr>
                </thead>
                <tbody>
                    {$rec}
                </tbody>
            </table>
        )

        return (
            <div>
                <form className="table-form">
                    {$questions}
                </form>
                <div className="recommendations">
                    <h2>Recomendaciones Caso Base</h2>
                    {makeTable($baseRecommendations)}
                    {!gas && <h2>Recomendaciones Full Evacuation</h2>}
                    {!gas && makeTable($fullEvacRecommendations)}
                    {gas && <h2>Recomendaciones Gas Shut-In</h2>}
                    {gas && makeTable($gasRecommendations)}
                </div>
                <div className={'procedure' + (this.state.showProcedure ? ' shown' : '')}>
                    <h2 onClick={this.handleProcedureClick}>
                        <i className="rec-caret"></i>
                        Cálculo
                    </h2>
                    {this.state.showProcedure && $steps}
                </div>
                <div style={{whiteSpace: 'pre', display: 'none'}}>
                    State:<br />
                    {JSON.stringify(this.state, null, 4)}<br />
                </div>
            </div>
        )
    }
}
