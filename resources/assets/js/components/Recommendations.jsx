import React from 'react'

export default function Recommendations(props) {
    const list = props.recommendations.map((rec, i) =>
        <li key={i}>{rec}</li>
    )
    return (
        <div className="recommendations">
            <h2>Recomendaciones</h2>
            <ul>
                {list}
            </ul>
        </div>
    )
}

Recommendations.propTypes = {
    recommendations: React.PropTypes.array.isRequired
}
