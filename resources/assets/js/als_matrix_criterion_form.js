import './app.js'
import React from 'react'
import ReactDOM from 'react-dom'

import CriterionEditor from './components/CriterionEditor.jsx'

const data =
    JSON.parse(
        document
            .getElementById('value-functions-initial-data')
            .innerHTML
    )

const { alternatives, valueFunctions, type } = data

ReactDOM.render(
    <CriterionEditor
        alternatives={alternatives}
        initialValueFunctions={valueFunctions}
        initialType={type}
    />,
    document.getElementById('value-function-editor')
)
