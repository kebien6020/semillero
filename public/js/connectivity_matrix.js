(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

$('.success-panel, .error-panel').addClass('alert fade in');
$().alert();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = QuestionForm;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderInput(data, handleChange) {
    var description = data.description ? _react2.default.createElement(
        'p',
        null,
        data.description
    ) : null;
    if (data.type === 'boolean') {
        // Render as checkbox
        return _react2.default.createElement(
            'div',
            { className: 'form-group', key: data.id },
            _react2.default.createElement(
                'label',
                null,
                _react2.default.createElement('input', {
                    type: 'checkbox',
                    value: data.id,
                    checked: data.answer,
                    onChange: function onChange(event) {
                        return handleChange(event, data.type, data.id);
                    }
                }),
                data.text
            ),
            description
        );
    } else if (data.type === 'multi') {
        // Render as select
        var options = data.options.map(function (opt) {
            return _react2.default.createElement(
                'option',
                { value: opt, key: opt },
                opt
            );
        });
        return _react2.default.createElement(
            'div',
            { className: 'form-group', key: data.id },
            _react2.default.createElement(
                'label',
                null,
                data.text
            ),
            description,
            _react2.default.createElement(
                'select',
                {
                    onChange: function onChange(event) {
                        return handleChange(event, data.type, data.id);
                    },
                    value: data.answer },
                options
            )
        );
    }
}

function QuestionForm(props) {
    var questions = props.questions;

    var inputs = questions.map(function (data) {
        return renderInput(data, props.handleChange);
    });
    var formStyle = {
        paddingLeft: '15px',
        paddingRight: '15px'
    };
    return _react2.default.createElement(
        'form',
        { style: formStyle },
        inputs,
        _react2.default.createElement('hr', { style: { borderColor: 'green' } })
    );
}

QuestionForm.propTypes = {
    questions: _react2.default.PropTypes.array.isRequired,
    handleChange: _react2.default.PropTypes.func
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _QuestionForm = require('./QuestionForm.jsx');

var _QuestionForm2 = _interopRequireDefault(_QuestionForm);

var _Recommendations = require('./Recommendations.jsx');

var _Recommendations2 = _interopRequireDefault(_Recommendations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuestionMatrix = function (_React$Component) {
    _inherits(QuestionMatrix, _React$Component);

    function QuestionMatrix(props) {
        _classCallCheck(this, QuestionMatrix);

        var _this = _possibleConstructorReturn(this, (QuestionMatrix.__proto__ || Object.getPrototypeOf(QuestionMatrix)).call(this, props));

        var answers = props.questions.map(function (q) {
            return q.default;
        });
        _this.state = {
            answers: answers
        };
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(QuestionMatrix, [{
        key: 'handleChange',
        value: function handleChange(event, type, questionId) {
            var value = type === 'boolean' ? event.target.checked : event.target.value;
            this.setState(function (state) {
                state.answers[questionId] = value;
                return state;
            });
        }
    }, {
        key: 'shownQuestions',
        value: function shownQuestions(questions, answers) {
            var answered = questions.map(function (q, i) {
                q.answer = answers[i];
                q.id = i;
                q.show = true;
                return q;
            });
            // filter by prereqs
            for (var i = 0; i < answered.length; ++i) {
                var q = answered[i];
                // if there is no prereqs, just show the question
                q.show = q.prereq.length === 0 || q.prereq.some(function (p) {
                    return answered[p.id].answer === p.answer && answered[p.id].show;
                });
            }
            return answered.filter(function (q) {
                return q.show;
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var shown = this.shownQuestions(this.props.questions, this.state.answers);
            var flatMap = function flatMap(arr, lambda) {
                return Array.prototype.concat.apply([], arr.map(lambda));
            };
            var recommendations = flatMap(shown, function (q) {
                var recomendation = q.recommend[q.answer.toString()];
                if (recomendation) return recomendation;
                return [];
            }).filter(function (rec) {
                return rec !== null;
            }).map(function (rec) {
                return _this2.props.recommendationText[rec];
            });
            recommendations = new Set(recommendations);
            recommendations = [].concat(_toConsumableArray(recommendations));
            if (recommendations.length === 0) recommendations = [this.props.noRecommendations];
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_QuestionForm2.default, {
                    questions: shown,
                    handleChange: this.handleChange.bind(this)
                }),
                _react2.default.createElement(_Recommendations2.default, {
                    recommendations: recommendations
                })
            );
        }
    }]);

    return QuestionMatrix;
}(_react2.default.Component);

exports.default = QuestionMatrix;


QuestionMatrix.propTypes = {
    questions: _react2.default.PropTypes.array.isRequired,
    recommendationText: _react2.default.PropTypes.object.isRequired,
    noRecommendations: _react2.default.PropTypes.string.isRequired
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./QuestionForm.jsx":2,"./Recommendations.jsx":4}],4:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Recommendations;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Recommendations(props) {
    var list = props.recommendations.map(function (rec, i) {
        return _react2.default.createElement(
            "li",
            { key: i },
            rec
        );
    });
    return _react2.default.createElement(
        "div",
        { className: "recommendations" },
        _react2.default.createElement(
            "h2",
            null,
            "Recomendaciones"
        ),
        _react2.default.createElement(
            "ul",
            null,
            list
        )
    );
}

Recommendations.propTypes = {
    recommendations: _react2.default.PropTypes.array.isRequired
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
'use strict';

require('./app');

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _QuestionMatrix = require('./components/QuestionMatrix.jsx');

var _QuestionMatrix2 = _interopRequireDefault(_QuestionMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questions = [
// 0
{
    text: 'Condición de presión',
    type: 'multi',
    options: ['Bajo balance', 'Sobre balance', 'Desconocida'],
    default: 'Sobre balance',
    prereq: [],
    recommend: {}
},
// 1
{
    text: '¿El pozo se encuentra con tubería de producción o con revestimiento?',
    type: 'multi',
    options: ['Tubería de producción', 'Revestimiento'],
    default: 'Revestimiento',
    prereq: [{
        id: 0,
        answer: 'Desconocida'
    }],
    recommend: {
        'Revestimiento': ['gun']
    }
},
// 2
{
    text: '¿La sección a cañonear es de gran longitud y se requiere una densidad de disparo > 6TTP?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 0,
        answer: 'Bajo balance'
    }],
    recommend: {
        'true': ['tcp', 'pure'],
        'false': ['thru', 'slickline']
    }
},
// 3
{
    text: '¿Es necesaria una velocidad de operación alta?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 0,
        answer: 'Sobre balance'
    }],
    recommend: {
        'true': ['gun', 'extreme'],
        'false': ['thru', 'extreme']
    }
},
// 4
{
    text: ['Se tiene alguna de estas condiciones?', _react2.default.createElement(
        'ul',
        { key: '0' },
        _react2.default.createElement(
            'li',
            null,
            '\xC1ngulo de pozo > 60\xB0.'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Requiere ca\xF1onear zonas m\xFAltiples.'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Densidad de disparo > 6 TTP.'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Ca\xF1onear zonas profundas'
        )
    )],
    type: 'boolean',
    default: false,
    prereq: [{
        id: 1,
        answer: 'Tubería de producción'
    }],
    recommend: {
        'true': ['tcp', 'high'],
        'false': ['thru']
    }
}];

var makeLink = function makeLink(name, text) {
    return _react2.default.createElement(
        'a',
        { href: '/conectividad/matrix/explanations#' + name },
        text
    );
};

var recommendations = {
    thru: [makeLink('thru', 'Through Tubing Wireline'), ' (cañoneo a través de tubería de producción bajado con línea eléctrica)'],
    tcp: [makeLink('tcp', 'TCP'), ' (cañoneo bajado con la tubería de producción)'],
    gun: [makeLink('gun', 'Casing Gun Wireline'), ' (cañoneo a través de revestimiento bajado con línea eléctrica)'],
    pure: 'Sugerencia: Utilizar la técnica Pure para que los perforados queden limpios, incrementar la productividad e inyectabilidad en los pozos. Además permite minimizar el daño por el cañoneo.',
    slickline: 'Sugerencia: Utilizar cargas que minimicen la producción de derbis.',
    extreme: 'Sugerencia: Utilizar la técnica de sobre balance extremo para minimizar el daño e incrementar la conectividad.',
    high: 'Sugerencia: Utilizar un sistema de High Shot Density (alta densidad de disparo). También se puede utilizar el método Through tubing con coiled tubing para pozos altamente desviados.'

};

_reactDom2.default.render(_react2.default.createElement(_QuestionMatrix2.default, {
    questions: questions,
    recommendationText: recommendations,
    noRecommendations: 'No se recomienda completamiento m\xFAltiple'
}), document.getElementById('matrix'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":1,"./components/QuestionMatrix.jsx":3}]},{},[5]);

//# sourceMappingURL=connectivity_matrix.js.map
