import React, { Component } from 'react'
import NumericInput from 'react-numeric-input'

let intermediateData = {}
const intermediate = (name, showName, value, image = null) => {
    intermediateData[name] = {
        showName,
        value,
        image
    }
}

import questionsTemp from './pipe_matrix_questions.js'
const { questions, recommendations } = questionsTemp(intermediate)

const getQuestion = (questions, name) => {
    return questions.filter(q => q.name === name)[0]
}

export default class PipeMatrix extends Component {

    constructor(props) {
        super(props)
        this.state = {
            answers: {
                // Some test values
                // 'water_cut_1': true,
                // 'gases': true,
                // 'p_co2': 500000,
                // 'alk': 300,
                // 'bht': 80,
                // 'bhp': 150,
                // 'i': 0.5,
                // 'ask_ph': 'ph>=5',
                // 'qo': 6000,
                // 'qw': 7000,
                // 'qg': 4.5e5,
                // 'api': 10,
                // 'rhoW': 62.4,
                // 'rhoG': 7,
                // 'muO': 2.1,
                // 'muW': 0.8,
                // 'muG': 0.2,
                // 'sigmaO': 2300,
                // 'sigmaW': 72.75,
                // 'id': 4,
            },
            showProcedure: false,
        }

        // Bind `this` to methods
        ;[
            'renderQuestion',
            'handleAnswer',
            'shownQuestions',
            'render',
            'neededActions',
            'referencedQuestions',
            'shownRecommendations',
            'handleProcedureClick',
            'renderRecommendation'
        ].forEach(fName => this[fName] = this[fName].bind(this))
    }

    // # Handlers
    handleAnswer(question, answer) {
        intermediateData = {}
        function doHandle(state, question, answer){
            if (question.processing)
                if (question.type === 'multiquestion') {
                    const otherAns =
                        question.questions
                            .map(qName => state.answers[qName])
                    state.answers[question.name] = question.processing(otherAns)
                } else {
                    state.answers[question.name] = question.processing(answer)
                }
            else
                state.answers[question.name] = answer

            if (question.parent)
                state = doHandle(state, question.parent, answer)
            return state
        }

        if (answer !== null)
            this.setState(state => doHandle(state, question, answer))

    }

    handleProcedureClick() {
        this.setState(state => {
            state.showProcedure = !state.showProcedure
            return state
        })
    }

    // # Render functions
    renderQuestion(question) {
        if (question.type === 'multi') {
            const $opts = question.options.map(option =>
                <option value={option.name} key={option.name}>{option.text}</option>
            )
            return (
                <div className="my-form-group" key={question.name}>
                    <label htmlFor={question.name}>{question.text}</label>
                    <select
                        id={question.name}
                        onChange={(ev) => this.handleAnswer(question, ev.target.value)}>
                        {$opts}
                    </select>
                </div>
            )
        } else if (question.type === 'boolean') {
            return (
                <div className="my-form-group" key={question.name}>
                    <input
                        type="checkbox"
                        id={question.name}
                        onChange={(ev) => this.handleAnswer(question, ev.target.checked)}
                    />
                    <label htmlFor={question.name}>{question.text}</label>
                </div>
            )
        } else if (question.type === 'numeric') {
            return (
                <div className="my-form-group" key={question.name}>
                    <label htmlFor={question.name}>{question.text}</label>
                    <NumericInput
                        id={question.name}
                        precision={question.precision !== undefined ? question.precision : 2}
                        value={this.state.answers[question.name]}
                        style={false}
                        onChange={num => this.handleAnswer(question, num)} />
                </div>
            )
        } else if (question.type === 'multiquestion') {
            return (
                question.questions
                    .map(qName => getQuestion(questions, qName))
                    .map(q => {
                        q.parent = question
                        return q
                    })
                    .map(q => this.renderQuestion(q))
            )
        }
    }

    // # Helpers
    // Some helpers to be used within render

    neededActions(question, answers) {
        let ans = answers[question.name]
        if (ans === undefined)
            if (question.type === 'boolean')
                ans = false
            else if (question.type === 'multi')
                ans = question.options[0].name

        if (question.actions[ans] === undefined) return []
        return question.actions[ans]
    }

    referencedQuestions(question, answers) {
        const flatmap = (arr, cb) => [].concat(...arr.map(cb))
        const actions = this.neededActions(question, answers)
            .filter(q => q.type === 'question')
        if (actions && actions.length > 0) {
            const refs = actions
                .map(action => getQuestion(questions, action.name))
            return refs.concat(flatmap(refs, q => this.referencedQuestions(q, answers)))
        } else {
            return []
        }
    }

    // Filter the questions that need to be shown
    shownQuestions(questions, answers) {
        return[questions[0]]
            .concat(this.referencedQuestions(questions[0], answers))
    }

    shownRecommendations(questions, answers) {
        const flatmap = (arr, cb) => [].concat(...arr.map(cb))
        return flatmap(
            this.shownQuestions(questions, answers),
            q => this.neededActions(q, answers))
            .filter(action => action.type === 'recommendation')
            .map(action => action.recommendation)
    }

    renderRecommendation(recs, i) {
        if (typeof recs === 'string') return <p key={i}>{recs}</p>
        return (
            <ul key={i}>{recs.map((rec, j) =>
                <li key={j}>
                    {recommendations[rec].name}
                    {recommendations[rec].pipe &&
                        <span>(<a href={`estallido?grado=${rec}&sistema=${this.state.answers.system_type || 'gc'}`} target="_blank">
                            Calcular estallido/colapso
                        </a>)</span>
                    }</li>
            )}</ul>
        )
    }

    renderStep(step, i) {
        const img = <div>
                        <img src={step.image} alt={'Gráfica: ' + step.showName} />
                    </div>
        if (typeof step.value === 'number' && isNaN(step.value))
            return null
        return (
            <tr key={i}>
                <td><strong>{step.showName}: </strong></td>
                <td>{step.value}</td>
                <td>{step.image ? img : 'No aplica'}</td>
            </tr>
        )
    }

    // # Main render
    render() {
        const $questions = this.shownQuestions(questions, this.state.answers).map(this.renderQuestion)

        const $recommendations = this.shownRecommendations(questions, this.state.answers).map(this.renderRecommendation)

        const $steps = Object.values(intermediateData).map(this.renderStep)

        return (
            <div>
                <form>
                    {$questions}
                </form>
                <div className="recommendations">
                    <h2>Recomendaciones</h2>
                    <div>
                        {$recommendations}
                    </div>
                </div>
                <div className={'procedure' + (this.state.showProcedure ? ' shown' : '')}>
                    <h2 onClick={this.handleProcedureClick}>
                        <i className="rec-caret"></i>
                        Cálculo
                    </h2>
                    {this.state.showProcedure && <table>
                        <thead>
                            <tr>
                                <th>Parámetro</th>
                                <th>Resultado</th>
                                <th>Fuente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$steps}
                        </tbody>
                    </table>}
                </div>
                <div style={{whiteSpace: 'pre', display: 'none'}}>
                    Procedimiento:<br />
                    {JSON.stringify(intermediateData, null, 4)}<br />
                    State:<br />
                    {JSON.stringify(this.state, null, 4)}<br />
                </div>
            </div>
        )
    }
}
