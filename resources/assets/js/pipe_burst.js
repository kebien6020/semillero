import './app'

import React from 'react'
import ReactDOM from 'react-dom'

import PipeBurst from './Components/PipeBurst.jsx'

const $app = document.getElementById('app')

function getQueryParams(qs) {
    const normalized = qs.replace(/\+/g, ' ')

    const params = {}
        , re = /[?&]?([^=]+)=([^&]*)/g
    let tokens
    while ((tokens = re.exec(normalized)) !== null)
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])

    return params
}

const {grado, sistema} = getQueryParams(document.location.search)

ReactDOM.render(<PipeBurst grade={grado} systemType={sistema} />, $app)
