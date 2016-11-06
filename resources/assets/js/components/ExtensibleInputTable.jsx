import React from 'react'
import Immutable from 'immutable'

const DEFAULT_SIZE = 3

export default class ExtensibleInputTable extends React.Component {
    constructor(props) {
        super(props)
        const defaultContent =
            Array(DEFAULT_SIZE).fill(Array(props.titles.length).fill(''))
        const content =
            (props.content && props.content.length !== 0) ? props.content : defaultContent
        this.state = {content: Immutable.fromJS(content)}
    }

    handleChange(event, targetI, targetJ) {
        const value = event.target.value.replace(',', '.')
        // TODO: move validation to onBlur and show error messages
        if (!isNaN(Number(value))){
            const newContent = this.state.content.setIn([targetI, targetJ], value)
            this.setState({content: newContent})
        }
    }

    handleRowBlur() {
        const comparator = (left, right) => {
            const a = Number(left.get(0))
            const b = Number(right.get(0))
            return a === b ? 0 : (a < b ? -1 : 1)
        }
        const newContent = this.state.content.sort(comparator)
        if (!this.state.content.equals(newContent)) {
            this.setState({content: newContent})
            // Force lost focus
            setTimeout(() => document.activeElement.blur(), 0)
        }
    }

    addRow() {
        this.setState({
            content: this.state.content.push(Immutable.List.of('', ''))
        })
    }

    removeRow() {
        this.setState({
            content: this.state.content.pop()
        })
    }

    render() {
        const ths = this.props.titles.map((title, i) => (<th key={i}>{title}</th>))
        const rows = this.state.content.map((row, i) => (
            <tr key={i}>
                {row.map((value, j) => (
                    <td key={j}>
                        <input type="text"
                            name={`${this.props.alternative.id}-${i}-${j}`}
                            value={value}
                            required="required"
                            onChange={(event) => this.handleChange(event, i, j)}
                            onBlur={() => {
                                if (j === row.size - 1)
                                    this.handleRowBlur()
                            }}
                        />
                    </td>
                ))}
            </tr>
        ))
        return (
            <table>
                <thead>
                    <tr>
                        <th colSpan="2">{this.props.alternative.name}</th>
                    </tr>
                    <tr>
                        {ths}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                    <tr>
                        <td colSpan="2">
                            <button type="button" className="plus-button" onClick={this.addRow.bind(this)}>
                                <span className="glyphicon glyphicon-plus"></span>Adicionar Fila
                            </button>
                            <button type="button" className="minus-button" onClick={this.removeRow.bind(this)}>
                                <span className="glyphicon glyphicon-minus"></span>Eliminar Fila
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

ExtensibleInputTable.propTypes = {
    titles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    content: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)),
    alternative: React.PropTypes.object.isRequired
}
