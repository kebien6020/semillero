import React from 'react'
import ReactDOM from 'react-dom'

import ExtensibleInputTable from './components/ExtensibleInputTable.jsx'

const valueFunctions =
    JSON.parse(
        document
            .getElementById('value-functions-initial-data')
            .innerHTML
    )
const editors = valueFunctions.map((valueFunction, i) => {
    return (
        <ExtensibleInputTable
            system={valueFunction.system}
            titles={['Valor', 'Puntaje']}
            content={valueFunction.data}
            key={i}
        />
    )
})

ReactDOM.render(
    <div>{editors}</div>,
    document.getElementById('value-function-editor')
)
