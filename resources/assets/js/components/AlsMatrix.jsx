import React from 'react'

export default class AlsMatrix extends React.Component {
    constructor(props) {
        super(props)
        const { criteria, alternatives } = this.props
        const answers = criteria.reduce((arr, criterion) => {
            if (criterion.type === 'multi')
                arr[criterion.id] = criterion.valueFunctions[0].data[0][0]
            else
                arr[criterion.id] = ''

            return arr
        }, [])

        this.alternatives = []
        for (const alternativeId in alternatives)
            if (alternatives.hasOwnProperty(alternativeId))
                this.alternatives[alternativeId] = {
                    id: alternativeId,
                    name: alternatives[alternativeId],
                }



        this.criteria = criteria.reduce((arr, criterion) => {
            arr[criterion.id] = {}
            if (criterion.type === 'multi')
                arr[criterion.id].options =
                    criterion.valueFunctions[0].data.map(([x]) => x)
            arr[criterion.id].name = criterion.name
            arr[criterion.id].type = criterion.type
            arr[criterion.id].weight = criterion.weight
            arr[criterion.id].id = criterion.id
            arr[criterion.id].valueFunctions = []
            for (const func of criterion.valueFunctions)
                arr[criterion.id].valueFunctions[func.id] = func

            return arr
        }, [])

        this.state = {
            answers,
            showTable: false,
        }

        this.handleShowTableChange = this.handleShowTableChange.bind(this)
        this.handleAnswerChange = this.handleAnswerChange.bind(this)
        this.calcScore = this.calcScore.bind(this)
        this.interpolateIn = this.interpolateIn.bind(this)
        this.renderInput = this.renderInput.bind(this)
    }

    handleShowTableChange(event) {
        const checked = event.target.checked
        this.setState(state => {
            state.showTable = checked
            return state
        })
    }

    handleAnswerChange(value, criterionId) {
        this.setState(state => {
            state.answers[criterionId] = value
            return state
        })
    }

    interpolate(value, x1, y1, x2, y2) {
        return y1 + (value - x1) * (y2 - y1) / (x2 - x1)
    }

    interpolateIn(value, data) {
        if (data.length <= 1) {
            return 'Funcion valor incompleta'
        } else if (value < data[0][0]) {
            return 'Fuera de rango (Valor especificado muy bajo)'
        } else if (value > data[data.length - 1][0]) {
            return 'Fuera de rango (Valor especificado muy alto)'
        } else {
            let currentPoint = 0
            while (data[currentPoint + 1][0] < value)
                ++currentPoint
            return this.interpolate(
                value,
                data[currentPoint][0],
                data[currentPoint][1],
                data[currentPoint + 1][0],
                data[currentPoint + 1][1]
            )
        }
    }

    calcScore(criterion, alternative, answer) {
        const data = criterion.valueFunctions[alternative.id].data
        if (criterion.type === 'multi')
            return Number(data.filter(([x]) => x === answer)[0][1])
        if (answer === '' || isNaN(Number(answer)))
            return null
        return this.interpolateIn(Number(answer), data.map(point =>
            [Number(point[0]), Number(point[1])]
        ))
    }

    calcResults(scores, weights) {
        // util
        const sum = (a, b) => a + b
        const min = (arr) => Math.min(...arr)
        const max = (arr) => Math.max(...arr)
        const flat = (arr) => arr.reduce((acc, v) => acc.concat(v), [])
        const isNumber = v => !isNaN(Number(v))
        // Step 1: Scores - Provided as param
        // Step 2: Normalize
        const R = scores.map(row => (
            row.map(cell => cell / row.reduce(sum, 0))
        ))
        // Step 3: weight
        const normalizedWeights = weights.map(w => w / weights.reduce(sum, 0))
        const T = R.map((row, criterionId) => (
            row.map(cell => cell * normalizedWeights[criterionId])
        ))
        // Step 4: best and worse condition
        const twj = min(flat(T).filter(isNumber))
        const tbj = max(flat(T).filter(isNumber))

        // Step 5: distances
        const alternativeIds = scores[scores.length - 1].map((cell, alternativeId) => alternativeId)
        const diw = alternativeIds.map(alternativeId => {
            return (
                T.map(row => row[alternativeId])
                 .filter(isNumber)
                 .reduce((acc, cell) => acc + (cell - twj) * (cell - twj), 0)
            )
        }).map(Math.sqrt)

        const dib = alternativeIds.map(alternativeId => {
            return (
                T.map(row => row[alternativeId])
                 .filter(isNumber)
                 .reduce((acc, cell) => acc + (cell - tbj) * (cell - tbj), 0)
            )
        }).map(Math.sqrt)

        // Step 6: Calc siw
        const siw = diw.map((dw, i) => dw / (dw + dib[i]))

        return siw.map((sw, i) => ({
            alternativeId: i,
            score: sw
        })).sort((left, right) => right.score - left.score)
    }

    renderInput(criterion, answer) {
        if (criterion.type === 'numeric') {
            return (
                <input
                    type="text"
                    id={'input-' + criterion.id}
                    name={'input-' + criterion.id}
                    placeholder={criterion.name}
                    value={answer}
                    onChange={(event) =>
                        this.handleAnswerChange(event.target.value, criterion.id)
                    }
                />
            )
        } else {
            const options = criterion.options.map(op =>
                <option value={op} key={op}>{op}</option>
            )
            return (
                <select
                    id={'input-' + criterion.id}
                    name={'input-' + criterion.id}
                    value={answer}
                    onChange={(event) =>
                        this.handleAnswerChange(event.target.value, criterion.id)
                    }
                >
                    {options}
                </select>
            )
        }
    }

    render() {
        const { criteria, alternatives } = this
        const { answers, showTable } = this.state
        const formGroups = answers.map((answer, id) => {
            const criterion = criteria[id]
            return (
                <div className="form-group" key={id}>
                    <label htmlFor={'input-' + id}>{criterion.name}</label>
                    {this.renderInput(criterion, answer)}
                </div>
            )
        })

        const scores = []
        criteria.forEach(criterion =>{
            scores[criterion.id] = []
            alternatives.forEach(alternative => {
                scores[criterion.id][alternative.id] =
                this.calcScore(criterion, alternative, answers[criterion.id])
            })
        })

        let scoreTable = null
        if (showTable)
            scoreTable = (
                <table>
                    <thead>
                        <tr>
                            <td></td>
                            {alternatives.map((alternative, id) => (<th key={id}>
                                {alternative.name}
                            </th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {criteria.map(criterion => (<tr key={criterion.id}>
                            <th>{criterion.name}</th>
                            {alternatives.map(alternative => (<td key={alternative.id}>
                                {scores[criterion.id][alternative.id]}
                            </td>))}
                        </tr>))}
                    </tbody>
                </table>
            )
        const weights = criteria.map(criterion => {
            return criterion.weight
        })
        const ruledOut = []
        scores.forEach(row => {
            row.forEach((cell, alternativeId) => {
                if (typeof cell === 'string')
                    ruledOut.push(alternativeId)
            })
        })
        const filteredScores = scores.map(row => {
            ruledOut.forEach(id =>{
                delete row[id]
            })
            return row
        })
        const results = this.calcResults(filteredScores, weights)
        const listItems = results.map((r, i) => (<li key={i}>
            {alternatives[r.alternativeId].name}
            {` (Puntaje TOPSIS = ${r.score.toFixed(4)})`}
        </li>))
        if (Object.keys(listItems).length === 0)
            listItems.push(<li key="n/a">Ninguna. Revise la tabla de puntajes, ya que todos los sistemas fueron excluidos por rangos operativos.</li>)
        const recommendations = (
            <div>
                <h2>Recomendaciones</h2>
                <ol>
                    {listItems}
                </ol>
            </div>
        )
        return (
            <form className="form-3-9">
                {formGroups}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={showTable}
                            onChange={this.handleShowTableChange}
                        />
                        Mostrar tabla de puntajes
                    </label>
                </div>
                {scoreTable}
                {recommendations}
            </form>
        )
    }
}

AlsMatrix.propTypes = {
    criteria: React.PropTypes.array.isRequired,
    alternatives: React.PropTypes.object.isRequired,
}
