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
    'have-phi': {
        title: 'Matriz de Formacion',
        text: '¿Tiene el valor promedio de porosidad de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'phi': {
        text: 'Ingrese la porosidad',
        type: 'numeric',
        default: 15,
        prereq: {
            question: 'have-phi',
            answer: 'yes'
        }
    },
    'ambient': {
        text: '¿En que ambiente operacional se encuentra?',
        type: 'multi',
        options: {
            conventional: 'Convencional',
            unconventional: 'No Convencional'
        },
        default: 'conventional',
        prereq: {
            question: 'have-phi',
            answer: 'no'
        }
    },
    'reservoir': {
        text: 'Tipo de reservorio convencional',
        type: 'multi',
        options: {
            conventional: 'Completamiento convencional',
            'no-consolidated': 'Reservorios no consolidados',
            carbonate: 'Reservorios de carbonatos'
        },
        default: 'conventional',
        prereq: {
            question: 'ambient',
            answer: 'conventional'
        }
    },
    'fraq': {
        text: '¿Reservorios a fracturamiento hidráulico?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no',
        prereq: {
            question: 'reservoir',
            answer: 'carbonate'
        }
    },
    'multi-fraq': {
        text: '¿Reservorio a fracturamiento hidráulico multi-etapa en pozos horizontales?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no',
        prereq: {
            question: 'ambient',
            answer: 'unconventional'
        }
    },
    'have-ucs': {
        text: '¿Tiene el valor de UCS (Resistencia a la formación no confinada) en Psi?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'ucs': {
        text: 'Ingrese el valor de UCS en Psi',
        type: 'numeric',
        default: 3000,
        prereq: {
            question: 'have-ucs',
            answer: 'yes'
        }
    },
    'ucs-range': {
        text: '¿En que rango estimado según PVT se encuentra?',
        type: 'multi',
        options: {
            lt2200: '<2200 Psi',
            lt4900: '2200 a 4900 Psi',
            lt6500: '4900 a 6500 Psi',
            lt13000: '6500 a 13000 Psi',
            gt13000: '>13000 Psi'
        },
        default: 'lt4900',
        prereq: {
            question: 'have-ucs',
            answer: 'no'
        }
    },
    'py': {
        text: '¿Cuál es la presión promedio del yacimiento?',
        type: 'numeric',
        default: 3000
    },
    'pc': {
        text: '¿Cuál es la presión en cabezal?',
        type: 'numeric',
        default: 200
    },
    'type-s': {
        text: '¿Cuál es el factor de daño según el estado del pozo?',
        type: 'multi',
        options: {
            damaged: 'Pozo dañado',
            estimulated: 'Pozo estimulado'
        },
        default: 'damaged'
    },
    'damage': {
        text: '¿Altamente dañado?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no',
        prereq: {
            question: 'type-s',
            answer: 'damaged'
        }
    },
    'estimulation': {
        text: 'Tipo de estimulación',
        type: 'multi',
        options: {
            acid: 'Acidificación',
            hydraulic: 'F. Hidráulico',
            'massive-hidraulic': 'F. Hidráulico masivo'
        },
        default: 'acid',
        prereq: {
            question: 'type-s',
            answer: 'estimulated'
        }
    },
    'have-k': {
        text: '¿Tiene la permeabilidad promedio de la formación en miliDarcies?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'k': {
        text: 'Ingrese la permeabilidad',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-k',
            answer: 'yes'
        }
    },
    'formation-type': {
        text: '¿En qué tipo de formación se encuentra?',
        type: 'multi',
        options: {
            sand: 'Arena Consolidada',
            carbonate: 'Carbonato'
        },
        default: 'sand',
        prereq: {
            question: 'have-k',
            answer: 'no'
        }
    },
    'k-range-1': {
        text: '¿En que rango de permeabilidad se encuentra?',
        type: 'multi',
        options: {
            lt10: '< 10 mD',
            lt100: '10 mD a 100 mD',
            gt100: '> 100 mD'
        },
        default: 'lt100',
        prereq: {
            question: 'formation-type',
            answer: 'sand'
        }
    },
    'k-range-2': {
        text: '¿En que rango de permeabilidad se encuentra?',
        type: 'multi',
        options: {
            lt10: '< 10 mD',
            lt100: '10 mD a 100 mD',
            lt250: '100 mD a 250 mD',
            gt250: '> 250 mD'
        },
        default: 'lt100',
        prereq: {
            question: 'formation-type',
            answer: 'carbonate'
        }
    },
    'have-angle': {
        text: '¿Conoce el ángulo formado respecto a la vertical de formación?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'angle': {
        text: 'Ingrese el ángulo',
        type: 'numeric',
        default: 0,
        prereq: {
            question: 'have-angle',
            answer: 'yes'
        }
    },
    'angle-range': {
        text: '¿En que rango se encuentra según perforación?',
        type: 'multi',
        options: {
            low: 'Bajo (∢0 a 5)',
            medium: 'Medio (∢5 a 20)',
            high: 'Alto (∢20 a 40)'
        },
        default: 'low',
        prereq: {
            question: 'have-angle',
            answer: 'no'
        }
    },
    'time': {
        title: 'Matriz de tipo de fluido',
        text: '¿Qué rango de tiempo en horas dispone?',
        type: 'multi',
        options: {
            lt100: '1 a 100',
            lt200: '100 a 200',
            lt300: '200 a 300'
        },
        default: 'lt200'
    },
    'have-pressure': {
        text: '¿Conoce la presión promedio en fondo de pozo (Psi)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'pressure': {
        text: 'Ingrese la presión promedio en fondo de pozo',
        type: 'numeric',
        default: 3000,
        prereq: {
            question: 'have-pressure',
            answer: 'yes'
        }
    },
    'depth-1': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 6000,
        prereq: {
            question: 'have-pressure',
            answer: 'no'
        }
    },
    'have-temperature': {
        text: '¿Conoce la temperatura en (ºF)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'temperature': {
        text: 'Ingrese la temperatura en (ºF)',
        type: 'numeric',
        default: 200,
        prereq: {
            question: 'have-temperature',
            answer: 'yes'
        }
    },
    'depth-2': {
        text: 'Indicar la profundidad en pies del primer intervalo a cañonear',
        type: 'numeric',
        default: 6000,
        prereq: {
            question: 'have-temperature',
            answer: 'no'
        }
    },
    'fluid': {
        text: '¿Qué tipo de fluido tiene en yacimiento?',
        type: 'multi',
        options: {
            bifasic: 'Bifásico',
            trifasic: 'Trifásico'
        },
        default: 'bifasic'
    },
    'have-api': {
        text: '¿Conoce la gravedad API del crudo?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'api': {
        text: 'Ingrese la gravedad API del crudo',
        type: 'numeric',
        default: 20,
        prereq: {
            question: 'have-api',
            answer: 'yes'
        }
    },
    'oil-type': {
        text: '¿Qué tipo de crudo espera en superficie?',
        type: 'multi',
        options: {
            'e-heavy': 'Extrapesado (<9.9)',
            'heavy': 'Pesado (10 a 15)',
            'medium': 'Mediano (15 a 29.9)',
            'light': 'Liviano (30 a 39.9)',
            'condensed': 'Condensado (>40)'
        },
        default: 'medium',
        prereq: {
            question: 'have-api',
            answer: 'no'
        }
    },
    'have-visc-oil': {
        text: '¿Conoce la viscosidad del crudo en cP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'visc-oil': {
        text: 'Ingrese la viscosidad del crudo en cP',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-visc-oil',
            answer: 'yes'
        }
    },
    'have-salt-water': {
        text: '¿Conoce la salinidad del agua de formación (%)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'salt-water': {
        text: 'Ingrese la salinidad del agua de formación (%)',
        type: 'numeric',
        default: 15,
        prereq: {
            question: 'have-salt-water',
            answer: 'yes'
        }
    },
    'salt-water-range': {
        text: '¿Qué tipo de agua de formación según registros eléctricos tiene?',
        type: 'multi',
        options: {
            high: 'Alta resistividad (1-10%)',
            medium: 'Resistividad media (10-20%)',
            low: 'Baja resistividad (20 a 26%)'
        },
        default: 'medium',
        prereq: {
            question: 'have-salt-water',
            answer: 'no'
        }
    },
    'have-visc-water': {
        text: '¿Conoce la viscosidad del agua de formación en cP?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'visc-water': {
        text: 'Ingrese la viscosidad del agua de formación en cP',
        type: 'numeric',
        default: 50,
        prereq: {
            question: 'have-visc-water',
            answer: 'yes'
        }
    },
    'saturation-gas': {
        text: 'Indique la saturación inicial de gas en el yacimiento',
        type: 'numeric',
        default: 20,
        prereq: {
            question: 'fluid',
            answer: 'trifasic'
        }
    },
    'multiple-intervals': {
        title: 'Matriz de sistema de conectividad',
        text: '¿Se pretende cañonear múltiples intervalos?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no'
    },
    'speed': {
        text: '¿Es Obligatorio obtener una velocidad avanzada de operación (T<12 Horas) (Multizonal)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no',
        prereq: {
            question: 'multiple-intervals',
            answer: 'yes'
        }
    },
    'have-interval': {
        text: '¿Conoce cual es la longitud del intervalo a cañonear?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes',
        prereq: {
            question: 'multiple-intervals',
            answer: 'no'
        }
    },
    'interval': {
        text: 'Indicar la longitud del intervalo a cañonear',
        type: 'numeric',
        default: 45,
        prereq: {
            question: 'have-interval',
            answer: 'yes'
        }
    },
    'interval-range': {
        text: '¿Cual es el rango aproximado en pies?',
        type: 'multi',
        options: {
            lt30: '<30',
            lt60: '30 a 60',
            gt60: '>60'
        },
        default: 'lt60',
        prereq: {
            question: 'have-interval',
            answer: 'no'
        }
    },
    'have-diameter': {
        text: '¿Conoce el diámetro de perforado según la dureza de tubería?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'diameter': {
        text: 'Indicar el diámetro de perforado',
        type: 'numeric',
        default: 10,
        prereq: {
            question: 'have-diameter',
            answer: 'yes'
        }
    },
    'have-casing-id': {
        text: '¿Conoce el diámetro interno de la tubería de revestimiento?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'casing-id': {
        text: 'Indicar el diámetro interno de la tubería de revestimiento',
        type: 'numeric',
        default: 7,
        prereq: {
            question: 'have-casing-id',
            answer: 'yes'
        }
    },
    'casing-grade': {
        text: 'Indicar grado de la tubería de revestimiento',
        type: 'multi',
        options: {
            'none': 'No hay opciones'
        },
        default: 'none',
        prereq: {
            question: 'have-casing-id',
            answer: 'no'
        }
    },
    'pressure-condition': {
        text: '¿Con base al valor de presión promedio de formación, en que condición se pretende realizar la operación?',
        type: 'multi',
        options: {
            underbalance: 'Bajo-balance',
            overbalance: 'Sobre-balance'
        },
        default: 'overbalance'
    },
    'have-underbalance-pressure': {
        text: '¿Conoce el valor de bajo-balance dinámico en Psi?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes',
        prereq: {
            question: 'pressure-condition',
            answer: 'underbalance'
        }
    },
    'underbalance-pressure': {
        text: 'Indicar el valor de bajo-balance dinámico en Psi',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'yes'
        }
    },
    'gas-oil': {
        text: '¿Yacimiento de gas o de petróleo?',
        type: 'multi',
        options: {
            gas: 'Gas',
            oil: 'Petróleo'
        },
        default: 'oil',
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'no'
        }
    },
    'k-gas-oil': {
        text: 'Insertar valor de permeabilidad',
        type: 'numeric',
        default: 100,
        prereq: {
            question: 'have-underbalance-pressure',
            answer: 'no'
        }
    },
    'eob': {
        text: '¿Se pretende desarrollar EOB (Sobre-balance extremo)?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no',
        prereq: {
            question: 'pressure-condition',
            answer: 'overbalance'
        }
    },
    'have-pr': {
        text: '¿Conoce cual es la relación de productividad esperada por el pozo?',
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'yes'
    },
    'pr': {
        text: 'Insertar relación de productividad esperada por el pozo',
        type: 'numeric',
        default: 1,
        prereq: {
            question: 'have-pr',
            answer: 'yes'
        }
    },
    'pr-range': {
        text: '¿En que rango se encuentra?',
        type: 'multi',
        options: {
            lt08: '0.5 a 0.8',
            lt12: '0.8 a 1.2',
            lt15: '1.2 a 1.5'
        },
        default: 'lt12',
        prereq: {
            question: 'have-pr',
            answer: 'no'
        }
    },
    'conditions': {
        text: _react2.default.createElement(
            'p',
            null,
            '\xBFOperativamente, se tiene alguna de estas condiciones?',
            _react2.default.createElement(
                'ul',
                null,
                _react2.default.createElement(
                    'li',
                    null,
                    'El ensamblaje con Wireline supera el limite tensional o axial m\xE1ximo'
                ),
                _react2.default.createElement(
                    'li',
                    null,
                    'Producci\xF3n H2S y/o Co2'
                ),
                _react2.default.createElement(
                    'li',
                    null,
                    'Alta presi\xF3n en cabeza'
                )
            )
        ),
        type: 'multi',
        options: {
            yes: 'Si',
            no: 'No'
        },
        default: 'no'
    }
};

var NumericInput = function (_Component) {
    _inherits(NumericInput, _Component);

    function NumericInput(props) {
        _classCallCheck(this, NumericInput);

        var _this = _possibleConstructorReturn(this, (NumericInput.__proto__ || Object.getPrototypeOf(NumericInput)).call(this, props));

        _this.state = {
            showText: String(props.value)
        };
        return _this;
    }

    _createClass(NumericInput, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var isNumeric = function isNumeric(n) {
                return !isNaN(Number(n));
            };
            // Handle automatic reuse of components
            var showText = Number(this.state.showText) === this.props.value ? this.state.showText : String(this.props.value);
            return _react2.default.createElement('input', {
                type: 'text',
                value: showText,
                onChange: function onChange(e) {
                    var val = e.target.value;
                    val = val.replace(/,/g, '.');
                    if (isNumeric(val)) {
                        _this2.setState({ showText: val });
                        return _this2.props.onChange(Number(val));
                    }
                }
            });
        }
    }]);

    return NumericInput;
}(_react.Component);

function makeLink(name, text) {
    return _react2.default.createElement(
        'a',
        { href: '#' + name },
        text
    );
}

var NTPerforateMatrix = function (_Component2) {
    _inherits(NTPerforateMatrix, _Component2);

    function NTPerforateMatrix() {
        _classCallCheck(this, NTPerforateMatrix);

        var _this3 = _possibleConstructorReturn(this, (NTPerforateMatrix.__proto__ || Object.getPrototypeOf(NTPerforateMatrix)).call(this));

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

        _this3.state = {
            questionValues: questionValues
        };

        _this3.renderQuestion = _this3.renderQuestion.bind(_this3);
        _this3.renderMultiQuestion = _this3.renderMultiQuestion.bind(_this3);
        _this3.renderNumericQuestion = _this3.renderNumericQuestion.bind(_this3);
        _this3.change = _this3.change.bind(_this3);
        return _this3;
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
            var _this4 = this;

            return _react2.default.createElement(
                'select',
                { value: answer, onChange: function onChange(e) {
                        return _this4.change(e.target.value, name);
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
            var _this5 = this;

            return _react2.default.createElement(NumericInput, {
                value: answer,
                onChange: function onChange(val) {
                    return _this5.change(val, name);
                }
            });
        }
    }, {
        key: 'makePretty',
        value: function makePretty(input, question, name) {
            return _react2.default.createElement(
                'div',
                { key: name },
                question.title && _react2.default.createElement(
                    'h2',
                    null,
                    question.title
                ),
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
                var parentIsShown = shouldBeShown([null, questions[prereqQuestion]]);

                return answerShouldBe === answerIs && parentIsShown;
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
