import React from 'react'
import QuestionForm from './QuestionForm.jsx'
import Recommendations from './Recommendations.jsx'

export default class QuestionMatrix extends React.Component {
    constructor(props) {
        super(props)
        const answers = props.questions.map(q => q.default)
        this.state = {
            answers
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event, type, questionId) {
        const value = type === 'boolean' ? event.target.checked : event.target.value
        this.setState(state => {
            state.answers[questionId] = value
            return state
        })

    }

    shownQuestions(questions, answers) {
        const answered = questions
            .map((q, i) => {
                q.answer = answers[i]
                q.id = i
                q.show = true
                return q
            })
        // filter by prereqs
        for (let i = 0; i < answered.length; ++i) {
            const q = answered[i]
            // if there is no prereqs, just show the question
            q.show = q.prereq.length === 0 || q.prereq.some(p =>
                answered[p.id].answer === p.answer && answered[p.id].show
            )
        }
        return answered.filter(q => q.show)
    }

    render() {
        const shown = this.shownQuestions(this.props.questions, this.state.answers)
        const flatMap = (arr, lambda) => Array.prototype.concat.apply([], arr.map(lambda))
        let recommendations = flatMap(shown,
            q => {
                const recomendation = q.recommend[q.answer.toString()]
                if (recomendation)
                    return recomendation
                return []
            })
            .filter(rec => rec !== null)
            .map(rec => this.props.recommendationText[rec])
        if (recommendations.length === 0)
            recommendations = [this.props.noRecommendations]
        return (
            <div>
                <QuestionForm
                    questions={shown}
                    handleChange={this.handleChange.bind(this)}
                />
                <Recommendations
                    recommendations={recommendations}
                />
            </div>
        )
    }
}

QuestionMatrix.propTypes = {
    questions: React.PropTypes.array.isRequired,
    recommendationText: React.PropTypes.object.isRequired,
    noRecommendations: React.PropTypes.string.isRequired,
}
