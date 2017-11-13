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
    text: '¿Existe mas de una zona prospectiva en el pozo (inyección o producción)?',
    type: 'boolean',
    default: true,
    prereq: [],
    recommend: {}
},
// 1
{
    text: '¿Existe una diferencia de presión mayor a 250 psi entre los intervalos productores?',
    type: 'boolean',
    default: true,
    prereq: [{
        id: 0,
        answer: true
    }],
    recommend: {}
},
// 2
{
    text: '¿Existe una diferencia mayor de 6 Darcies entre las formaciones?',
    description: 'Considere que este parámetro es muy relativo, y no reemplaza ningún valor de campo, depende de la máxima diferencia de permeabilidades entre las formaciones productoras del campo.',
    type: 'boolean',
    default: true,
    prereq: [{
        id: 1,
        answer: true
    }],
    recommend: {}
},
// 3
{
    text: '¿Las capas productoras se encuentran divididas por barreras de muy baja permeabilidad de al menos 3 ft?',
    description: 'Se  consideran discontinuidades, arcillas, shales o arenas de muy baja permeabilidad como barreras, considere también la continuidad de la barrera que permita que hayan dos estratos de diferentes  características petrofísicas y de fluido a lo largo del yacimiento que no permitan que se crucen los fluidos detrás de la cara del pozo, el valor mínimo estimado para crear esa separación litológica es de 3 ft.',
    type: 'boolean',
    default: true,
    prereq: [{
        id: 2,
        answer: true
    }],
    recommend: {}
},
// 4
{
    text: '¿Acorde a las facilidades y la tasa de retorno es factible la instalación de un completamiento múltiple?',
    type: 'boolean',
    default: true,
    prereq: [{
        id: 3,
        answer: true
    }],
    recommend: {}
},
// 5
{
    text: '¿Una o mas capas productoras depletaron o entraron en irrupción de agua y gas?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 4,
        answer: true
    }],
    recommend: {}
},
// 6
{
    text: '¿Acorde a la conectividad del yacimiento las capas depletadas son candidatas a inyección para recobro o disposal?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 5,
        answer: true
    }],
    recommend: {
        'true': ['parallelInyProd']
    }
},
// 7
{
    text: 'Se definió tipo de pozo',
    type: 'multi',
    options: ['Inyector', 'Productor'],
    default: 'Productor',
    prereq: [{
        id: 5,
        answer: false
    }, {
        id: 6,
        answer: false
    }],
    recommend: {}
},
// 8
{
    text: '¿Espaciamiento entre arenas es menor a 60 pies?',
    description: 'Considere que este criterio ha sido seleccionado  con base en las longitudes mínimas de las siguientes herramientas de completamiento para la inyección selectiva: Empaque, Pup Joint, Mandril de Inyección, Pup Joint y Empaque.',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 7,
        answer: 'Inyector'
    }],
    recommend: {
        'true': ['directIny'],
        'false': ['vrf']
    }
},
// 9
{
    text: '¿Que tipo de pozo es con respecto a la geometría?',
    type: 'multi',
    options: ['Vertical o Desviado', 'Horizontal o Multilateral'],
    default: 'Vertical o Desviado',
    prereq: [{
        id: 7,
        answer: 'Productor'
    }],
    recommend: {}
},
// 10
{
    text: '¿Requiere fiscalizar las zonas de forma simultanea e independiente?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 9,
        answer: 'Vertical o Desviado'
    }],
    recommend: {
        'true': ['parallel', 'dualBes', 'dualGl']
    }
},
// 11
{
    text: '¿Desea tener control de reservas y retrasar frentes de agua de forma simultanea en todas las zonas?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 10,
        answer: false
    }],
    recommend: {
        'false': ['ssd']
    }
},
// 12
{
    text: '¿Cuál es el tipo de completamiento utilizado en el pozo?',
    type: 'multi',
    options: ['Hueco Revestido', 'Hueco Abierto/Gravel Pack'],
    default: 'Hueco Abierto/Gravel Pack',
    prereq: [{
        id: 9,
        answer: 'Horizontal o Multilateral'
    }, {
        id: 11,
        answer: true
    }],
    recommend: {
        'Hueco Abierto/Gravel Pack': ['icd']
    }
},
// 13
{
    text: '¿Se espera intrusión de agua?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 12,
        answer: 'Hueco Abierto/Gravel Pack'
    }],
    recommend: {
        'false': ['picd'],
        'true': ['aicd']
    }
},
// 14
{
    text: '¿Requiere futuras estimulaciones?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 12,
        answer: 'Hueco Revestido'
    }],
    recommend: {
        'true': ['ssv']
    }
},
// 15
{
    text: '¿Requiere evaluación independiente de cada zona?',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 14,
        answer: false
    }],
    recommend: {
        'true': ['ssd'],
        'false': ['icv']
    }
},
// 16
{
    text: '¿Hay presencia de zonas apretadas o shales?',
    description: 'Considere que las zonas apretadas van desde una permeabilidad de 0,01mD  hasta 0,1 mD y un yacimiento Shale a partir de 0,0001 mD hasta 0,01 mD.',
    type: 'boolean',
    default: false,
    prereq: [{
        id: 15,
        answer: false
    }],
    recommend: {
        'true': ['binaryValves'],
        'false': ['chokeValves']
    }
}];

var makeLink = function makeLink(id, text) {
    return _react2.default.createElement(
        'a',
        { href: '/multiples/matrix/explanations#' + id },
        text
    );
};

var recommendations = {
    parallelInyProd: 'Instalar sartas paralelas inyección/producción',
    directIny: makeLink('iny-directa', 'Completamiento de inyección directa'),
    vrf: [makeLink('vrf', 'Completamiento de inyección selectiva con VRF'), _react2.default.createElement('br', null), _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Nota:'
    ), ' Para este completamiento se consideraron espaciamientos mínimos de arenas con respecto a los datos adquiridos de completamientos de inyección selectiva en cargados en OpenWells', _react2.default.createElement(
        'span',
        null,
        '\xAE'
    )],
    parallel: ['Instalar sartas paralelas', _react2.default.createElement('br', null), _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Nota:'
    ), ' Si el pozo produce por flujo natural considere el completamiento de sartas paralelas para la producción de las dos zonas, de lo contrario consultar la matriz de selección preliminar de los sistemas de levantamiento artificial, si resulta que su pozo es un candidato para BES considere instalar el sistema Dual Concéntrico BES. Si resulta que su pozo es un candidato para gas lift considere instalar el sistema de gas lift dual.'],
    dualBes: [makeLink('dual-bes', 'Instalar completamiento dual concéntrico BES.'), _react2.default.createElement('br', null), _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Nota:'
    ), ' Tenga en cuenta los siguientes rangos de aplicación:', _react2.default.createElement(
        'ul',
        null,
        _react2.default.createElement(
            'li',
            null,
            'Angulo m\xE1ximo de desviaci\xF3n de 45\xBA'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Dog Leg menor a 8\xBA/100fT'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Di\xE1metro m\xEDnimo de revestimiento 9 5/8\u201D'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Tuber\xEDa de producci\xF3n con un di\xE1metro m\xEDnimo de 7\u201D'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Relaci\xF3n Gas-Petr\xF3leo no mayor al 10%'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Espaciamiento entre las arenas m\xEDnimo de 100 ft'
        )
    )],
    dualGl: ['Instalar completamiento dual Gas Lift', _react2.default.createElement('br', null), _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Nota:'
    ), ' Tenga en cuenta los siguientes rangos de aplicación:', _react2.default.createElement(
        'ul',
        null,
        _react2.default.createElement(
            'li',
            null,
            'Di\xE1metros m\xEDnimos de 9 5/8\u201D y para la zona de inter\xE9s un di\xE1metro de 7\u201D'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Tuber\xEDa de producci\xF3n de 2 7/8\u201D'
        ),
        _react2.default.createElement(
            'li',
            null,
            'Este dise\xF1o puede completarse con m\xE9todos para control de arena'
        )
    )],
    ssd: [makeLink('ssd', 'Instalar completamiento SSD.'), _react2.default.createElement('br', null), _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Nota:'
    ), ' La producción selectiva o secuencial permite la evaluación de zonas por medio de la producción secuencial de las mismas, sin embargo es posible producir más de una zona al tiempo.', _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Recomendaci\xF3n:'
    ), ' Si el pozo tiene una desviación mayor a 70 grados es recomendable utilizar herramientas de apertura y cierre E-Line.', _react2.default.createElement('br', null), _react2.default.createElement(
        'strong',
        null,
        'Recomendaci\xF3n:'
    ), ' Para instalar este tipo de completamiento requiere de un espesor mínimo de 45 ft de acuerdo a la longitud de cada compartimento.'],
    icd: makeLink('picd-aicd', 'Instalar completamiento ICD convencional'),
    picd: makeLink('picd-aicd', 'Instalar completamiento PICD'),
    aicd: makeLink('picd-aicd', 'Instalar completamiento AICD'),
    ssv: makeLink('icv', 'Instalar completamiento SSV'),
    icv: makeLink('icv', 'Instalar completamiento ICV'),
    binaryValves: _react2.default.createElement(
        'ul',
        null,
        _react2.default.createElement(
            'li',
            null,
            'Instalar v\xE1lvulas bianrias y de choke para ICV'
        )
    ),
    chokeValves: _react2.default.createElement(
        'ul',
        null,
        _react2.default.createElement(
            'li',
            null,
            'Instalar v\xE1lvulas de choke ICV'
        )
    )
};

_reactDom2.default.render(_react2.default.createElement(_QuestionMatrix2.default, {
    questions: questions,
    recommendationText: recommendations,
    noRecommendations: 'No se recomienda completamiento m\xFAltiple'
}), document.getElementById('matrix'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":1,"./components/QuestionMatrix.jsx":3}]},{},[5]);

//# sourceMappingURL=multiple_matrix.js.map
