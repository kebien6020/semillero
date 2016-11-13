import React from 'react'

function filledArray(data, size) {
    return Array(size).fill(data)
}

function arrayContains(value, arr) {
    return arr.indexOf(value) !== -1
}

export default function ExtensibleInputTable(props) {
    const {
        fixedColumns,
        inputNamePrefix,
        onChange,
        onRowBlur,
        titles,
        mainTitle,
        onAddRow,
        onRemoveRow,
        tag,
        content
    } = props

    const header =
        mainTitle ? <tr><th colSpan="2">{mainTitle}</th></tr> : null
    const ths = titles.map((title, i) => <th key={i}>{title}</th>)
    const rows = content.map((row, i) => (
        <tr key={i}>
            {row.map((value, j) => {
                if (arrayContains(j, fixedColumns))
                    return (
                        <td key={j}>
                            <span>{value}</span>
                            <input
                                type="hidden"
                                name={`${inputNamePrefix}${i}-${j}`}
                                value={value}
                            />
                        </td>
                    )
                else
                    return (
                        <td key={j}>
                            <input
                                type="text"
                                name={`${inputNamePrefix}${i}-${j}`}
                                value={value}
                                required="required"
                                onChange={(event) =>
                                    onChange(event.target.value, i, j, tag)
                                }
                                onBlur={() => {
                                    if (j === row.length - 1)
                                        onRowBlur(i, tag)
                                }}
                            />
                        </td>
                    )
            })}
        </tr>
    ))
    return (
        <table>
            <thead>
                {header}
                <tr>
                    {ths}
                </tr>
            </thead>
            <tbody>
                {rows}
                <tr>
                    <td colSpan="2">
                        <button
                            type="button"
                            className="plus-button"
                            onClick={() => onAddRow(tag)}
                        >
                            <span className="glyphicon glyphicon-plus" />
                            Adicionar Fila
                        </button>
                        <button
                            type="button"
                            className="minus-button"
                            onClick={() => onRemoveRow(tag)}
                        >
                            <span className="glyphicon glyphicon-minus" />
                            Eliminar Fila
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

ExtensibleInputTable.propTypes = {
    tag: React.PropTypes.any,
    titles: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    content: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.string)),
    mainTitle: React.PropTypes.string,
    inputNamePrefix: React.PropTypes.string,
    fixedColumns: React.PropTypes.arrayOf(React.PropTypes.number),
    // events
    onChange: React.PropTypes.func.isRequired,
    onRowBlur: React.PropTypes.func,
    onAddRow: React.PropTypes.func.isRequired,
    onRemoveRow: React.PropTypes.func.isRequired,
}

ExtensibleInputTable.defaultProps = {
    content: null,
    mainTitle: null,
    inputNamePrefix: '',
    fixedColumns: [],
    // events (by default do nothing)
    onRowBlur: () => {},
}
