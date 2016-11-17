import React from 'react'

function renderInput(data, handleChange) {
    const description = data.description ? <p>{data.description}</p> : null
    if (data.type === 'boolean') {
        // Render as checkbox
        return (
            <div className="form-group" key={data.id}>
                <label>
                    <input
                        type="checkbox"
                        value={data.id}
                        checked={data.answer}
                        onChange={(event) => handleChange(event, data.type, data.id)}
                    />
                    {data.text}
                </label>
                {description}
            </div>
        )
    } else if (data.type === 'multi') {
        // Render as select
        const options = data.options.map(opt => (
            <option value={opt} key={opt}>{opt}</option>
        ))
        return (
            <div className="form-group" key={data.id}>
                <label>{data.text}</label>
                {description}
                <select
                    onChange={(event) => handleChange(event, data.type, data.id)}
                    value={data.answer}>
                    {options}
                </select>
            </div>
        )
    }
}

export default function QuestionForm(props) {
    const questions = props.questions

    const inputs = questions.map(data => renderInput(data, props.handleChange))
    const formStyle = {
        paddingLeft: '15px',
        paddingRight: '15px',
    }
    return (
        <form style={formStyle}>
            {inputs}
            <hr style={{borderColor: 'green'}}/>
        </form>
    )
}

QuestionForm.propTypes = {
    questions: React.PropTypes.array.isRequired,
    handleChange: React.PropTypes.func,
}
