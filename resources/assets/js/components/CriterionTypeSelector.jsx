import React from 'react'

import ExtensibleInputTable from './ExtensibleInputTable.jsx'

export default function CriterionTypeSelector(props) {
    const {
        type,
        options,
        onTypeChange,
        onOptionsChange,
        onOptionAdd,
        onOptionRemove
    } = props
    let table = null
    if (type === 'multi')
        table = <ExtensibleInputTable
            titles={['Opciones para el criterio']}
            onChange={onOptionsChange}
            onAddRow={onOptionAdd}
            onRemoveRow={onOptionRemove}
            content={options.map(o => [o])}
        />

    return (
        <div className="form-group">
            <label>Tipo</label>
            <select name="type" value={type} onChange={onTypeChange}>
                <option value="numeric">Numerico</option>
                <option value="multi">Selección múltiple</option>
            </select>
            {table}
        </div>
    )
}

CriterionTypeSelector.propTypes = {
    type: React.PropTypes.string.isRequired,
    options: React.PropTypes.arrayOf(React.PropTypes.string),
    onTypeChange: React.PropTypes.func.isRequired,
    onOptionsChange: React.PropTypes.func.isRequired,
    onOptionAdd: React.PropTypes.func.isRequired,
    onOptionRemove: React.PropTypes.func.isRequired,
}

CriterionTypeSelector.defaultProps = {
    options: []
}
