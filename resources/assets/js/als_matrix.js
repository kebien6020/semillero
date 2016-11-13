import React from 'react'
import ReactDOM from 'react-dom'

import AlsMatrix from './components/AlsMatrix.jsx'

const { criteria, alternatives } = JSON.parse(document.getElementById('matrix-data').innerHTML)

ReactDOM.render(
    <AlsMatrix criteria={criteria} alternatives={alternatives} />,
    document.getElementById('matrix')
)
