import React from 'react'

import ExtensibleInputTable from './ExtensibleInputTable.jsx'
import TypeSelector from './CriterionTypeSelector.jsx'


export default class CriterionEditor extends React.Component {
    constructor(props) {
        super(props)
        const { initialType, alternatives } = props

        let initialValueFunctions
        if (props.initialValueFunctions)
            initialValueFunctions = props.initialValueFunctions
        else
            initialValueFunctions =
                Object.keys(alternatives).map(id => ({id: id}))

        // Add missing alternatives
        if (initialValueFunctions.length < Object.keys(alternatives).length)
            // eslint-disable-next-line prefer-const
            for (let alternativeId in alternatives)
                if (alternatives.hasOwnProperty(alternativeId))
                    if (!initialValueFunctions.some(func => Number(func.id) === Number(alternativeId)))
                        initialValueFunctions.push({id: alternativeId})

        initialValueFunctions = initialValueFunctions.map(func => {
            if (!func.data || func.data.length === 0)
                func.data = [['', ''], ['', ''], ['', '']]
            return func
        })

        let initialOptions
        if (props.initialOptions)
            initialOptions = props.initialOptions
        else if (initialType === 'multi')
            initialOptions = initialValueFunctions[0].data.map(([x]) => x)
        else
            initialOptions = ['', '']

        this.state = {
            type: initialType,
            options: initialOptions,
            valueFunctions: initialValueFunctions,
        }
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleOptionsChange = this.handleOptionsChange.bind(this)
        this.handleOptionAdd = this.handleOptionAdd.bind(this)
        this.handleOptionRemove = this.handleOptionRemove.bind(this)
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleTableAddRow = this.handleTableAddRow.bind(this)
        this.handleTableRemoveRow = this.handleTableRemoveRow.bind(this)
        this.handleTableRowBlur = this.handleTableRowBlur.bind(this)
    }

    handleTypeChange(event) {
        const type = event.target.value
        this.setState(state => {
            state.type = type
            state.valueFunctions = state.valueFunctions.map(func => {
                func.data = state.options.map((op, i) => {
                    if (func.data[i])
                        return [op, func.data[i][1]]
                    return [op, '']
                })
                return func
            })
            return state
        })
    }

    handleOptionsChange(value, i) {
        this.setState(state => {
            state.options[i] = value
            state.valueFunctions = state.valueFunctions.map(func => {
                func.data = state.options.map((op, i) => {
                    if (func.data[i])
                        return [op, func.data[i][1]]
                    return [op, '']
                })
                return func
            })
            return state
        })
    }

    handleOptionAdd() {
        this.setState(state => {
            state.options.push('')
            state.valueFunctions = state.valueFunctions.map(func => {
                func.data = state.options.map((op, i) => {
                    if (func.data[i])
                        return [op, func.data[i][1]]
                    return [op, '']
                })
                return func
            })
            return state
        })
    }

    handleOptionRemove() {
        if (this.state.options.length > 1)
            this.setState(state => {
                state.options.pop()
                state.valueFunctions = state.valueFunctions.map(func => {
                    func.data = state.options.map((op, i) => {
                        if (func.data[i])
                            return [op, func.data[i][1]]
                        return [op, '']
                    })
                    return func
                })
                return state
            })

    }

    handleTableChange(value, i, j, tag) {
        this.setState(state => {
            state.valueFunctions[tag].data[i][j] = value
            return state
        })
    }

    handleTableAddRow(tag) {
        this.setState(state => {
            state.valueFunctions[tag].data.push(['', ''])
            return state
        })
    }

    handleTableRemoveRow(tag) {
        this.setState(state => {
            state.valueFunctions[tag].data.pop()
            return state
        })
    }

    handleTableRowBlur(i, tag) {
        this.setState(state => {
            const typeIsNumeric = state.type === 'numeric'
            const newData = state.valueFunctions[tag].data.map(([x, y]) => {
                const newX = typeIsNumeric && isNaN(Number(x)) ? '' : x
                const newY = isNaN(Number(y)) ? '' : y
                return [newX, newY]
            })
            state.valueFunctions[tag].data = newData
            return state
        })
    }

    render() {
        const { alternatives } = this.props
        const { valueFunctions, type, options } = this.state
        const editors = valueFunctions.map((valueFunction, i) => {
            let content
            if (type === 'numeric')
                content = valueFunction.data
            else
                content = options.map((o, i) => {
                    const score = valueFunction.data[i] ? valueFunction.data[i][1] : ''
                    return [o, score]
                })
            return (
                <ExtensibleInputTable
                    key={i}
                    tag={i}
                    titles={['Valor', 'Puntaje']}
                    content={content}
                    mainTitle={alternatives[valueFunction.id].name}
                    inputNamePrefix={valueFunction.id + '-'}
                    fixedColumns={type === 'multi' ? [0] : []}
                    onChange={this.handleTableChange}
                    onAddRow={this.handleTableAddRow}
                    onRemoveRow={this.handleTableRemoveRow}
                    onRowBlur={this.handleTableRowBlur}
                />
            )
        })

        return (
            <div>
                <TypeSelector
                    type={this.state.type}
                    options={this.state.options}
                    onTypeChange={this.handleTypeChange}
                    onOptionsChange={this.handleOptionsChange}
                    onOptionAdd={this.handleOptionAdd}
                    onOptionRemove={this.handleOptionRemove}
                />
                {editors}
            </div>
        )
    }
}

CriterionEditor.propTypes = {
    initialValueFunctions: React.PropTypes.array,
    initialOptions: React.PropTypes.array,
    initialType: React.PropTypes.string,
    alternatives: React.PropTypes.object.isRequired,
}

CriterionEditor.defaultProps = {
    initialType: 'numeric',
}
