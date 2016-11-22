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

const { alternatives, valueFunctions, type, editMode } = data
const buttonText = (editMode ? 'Actualizar' : 'Agregar') + ' criterio'

ReactDOM.render(
    <div>
        <CriterionEditor
            alternatives={alternatives}
            initialValueFunctions={valueFunctions}
            initialType={type}
        />
        <div className="submit-container">
            <input type="submit" value={buttonText} />
        </div>
    </div>,
    document.getElementById('value-function-editor')
)
