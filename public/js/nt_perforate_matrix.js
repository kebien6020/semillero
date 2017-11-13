(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _Recommendations = require('./Recommendations.jsx');

var _Recommendations2 = _interopRequireDefault(_Recommendations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var questions = {
    '1': {
        text: '¿Cuál es la presión promedio del yacimiento?',
        type: 'numeric',
        default: 2000
    },
    '2': {
        text: '¿Presion en cabeza?',
        type: 'numeric',
        default: 100
    },
    '3': {
        text: '¿Conoce cual es la longitud del intervalo a cañonear?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    '4': {
        text: '¿Longitud del intervalo a cañonear?',
        type: 'numeric',
        default: 100,
        prereq: {
            question: '3',
            answer: 'yes'
        }
    },
    '5': {
        text: '¿Cual es el rango aproximado en pies?',
        type: 'multi',
        options: {
            lt30: '<30',
            bt3060: '30 a 60',
            gt60: '>60'
        },
        default: 'bt3060',
        prereq: {
            question: '3',
            answer: 'no'
        }
    },
    '6': {
        text: '¿Conoce el ángulo formado respecto a la vertical de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    '7': {
        text: '¿Angulo formado respecto a la vertical de formación?',
        type: 'numeric',
        default: 0,
        prereq: {
            question: '6',
            answer: 'yes'
        }
    },
    '8': {
        text: '¿En que rango se encuentra según perforación?',
        type: 'multi',
        options: {
            low: 'Bajo',
            medium: 'Medio',
            high: 'Alto'
        },
        default: 'low',
        prereq: {
            question: '6',
            answer: 'no'
        }
    },
    '9': {
        text: '¿Es Obligatorio obtener una velocidadavanzada de operación (T<12 Horas) (Multizonal)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no'
    },
    '10': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 100
    },
    '11': {
        text: '¿Se pretende cañonear múltiples intervalos?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no'
    },
    '12': {
        text: 'Ingrese Tasa de Productividad (%)',
        type: 'numeric',
        default: 80
    },
    '13': {
        text: 'Ingrese Profundidad de Penetración (mm)',
        type: 'numeric',
        default: 50
    }
};

function makeLink(name, text) {
    return _react2.default.createElement(
        'a',
        { href: '#' + name },
        text
    );
}

var NTPerforateMatrix = function (_Component) {
    _inherits(NTPerforateMatrix, _Component);

    function NTPerforateMatrix() {
        _classCallCheck(this, NTPerforateMatrix);

        var _this = _possibleConstructorReturn(this, (NTPerforateMatrix.__proto__ || Object.getPrototypeOf(NTPerforateMatrix)).call(this));

        var questionValues = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(questions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    name = _step$value[0],
                    question = _step$value[1];

                questionValues[name] = question.default;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        _this.state = {
            questionValues: questionValues
        };

        _this.renderQuestion = _this.renderQuestion.bind(_this);
        _this.renderMultiQuestion = _this.renderMultiQuestion.bind(_this);
        _this.renderNumericQuestion = _this.renderNumericQuestion.bind(_this);
        _this.change = _this.change.bind(_this);
        return _this;
    }

    _createClass(NTPerforateMatrix, [{
        key: 'change',
        value: function change(value, name) {
            var state = this.state;

            state.questionValues[name] = value;
            this.setState(state);
        }
    }, {
        key: 'renderMultiQuestion',
        value: function renderMultiQuestion(question, name, answer) {
            var _this2 = this;

            return _react2.default.createElement(
                'select',
                { value: answer, onChange: function onChange(e) {
                        return _this2.change(e.target.value, name);
                    } },
                Object.entries(question.options).map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        opName = _ref2[0],
                        text = _ref2[1];

                    return _react2.default.createElement(
                        'option',
                        { value: opName },
                        text
                    );
                })
            );
        }
    }, {
        key: 'renderNumericQuestion',
        value: function renderNumericQuestion(question, name, answer) {
            var _this3 = this;

            return _react2.default.createElement('input', {
                type: 'number',
                value: answer,
                onChange: function onChange(e) {
                    return _this3.change(e.target.value, name);
                }
            });
        }
    }, {
        key: 'makePretty',
        value: function makePretty(input, question, name) {
            return _react2.default.createElement(
                'div',
                { key: name },
                _react2.default.createElement(
                    'label',
                    { htmlFor: question.name },
                    question.text
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    input
                )
            );
        }
    }, {
        key: 'renderQuestion',
        value: function renderQuestion(_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                name = _ref4[0],
                question = _ref4[1];

            var state = this.state;

            var answer = state.questionValues[name];
            var input = null;
            switch (question.type) {
                case 'multi':
                    input = this.renderMultiQuestion(question, name, answer);
                    break;
                case 'numeric':
                    input = this.renderNumericQuestion(question, name, answer);
                    break;
                default:
                    throw Error('Unkown type of question: ' + question.type);
            }
            return this.makePretty(input, question);
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state;

            var shouldBeShown = function shouldBeShown(_ref5) {
                var _ref6 = _slicedToArray(_ref5, 2),
                    question = _ref6[1];

                if (!question.prereq) return true;
                var prereqQuestion = question.prereq.question;
                var answerShouldBe = question.prereq.answer;
                var answerIs = state.questionValues[prereqQuestion];

                return answerShouldBe === answerIs;
            };
            var shownQuestions = Object.entries(questions).filter(shouldBeShown);

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'form',
                    null,
                    shownQuestions.map(this.renderQuestion)
                ),
                _react2.default.createElement(_Recommendations2.default, { recommendations: [makeLink('stimtube', 'Tecnología Stimtube'), makeLink('powr-perf', 'Tecnología POWR/PERF'), makeLink('perf-stim', 'Tecnología PerfStim'), makeLink('plug-and-perf', 'Tecnología de completamiento de cañón insertable (Plug and Perf)')] })
            );
        }
    }]);

    return NTPerforateMatrix;
}(_react.Component);

exports.default = NTPerforateMatrix;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Recommendations.jsx":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _NTPerforateMatrix = require('./components/NTPerforateMatrix.jsx');

var _NTPerforateMatrix2 = _interopRequireDefault(_NTPerforateMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_NTPerforateMatrix2.default, null), document.getElementById('matrix'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/NTPerforateMatrix.jsx":1}]},{},[3]);

//# sourceMappingURL=nt_perforate_matrix.js.map
