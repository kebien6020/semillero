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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
    'ideal-diameter': {
        text: 'Indicar diametro ideal de perforado',
        type: 'numeric',
        default: 10,
        prereq: {
            question: 'have-diameter',
            answer: 'no'
        }
    },
    'casing-grade-0': {
        text: 'Indicar grado de tubería de revestimiento',
        type: 'multi',
        options: {
            j55: 'J-55',
            k55: 'K-55',
            c55: 'C-55',
            l80: 'L-80',
            n80: 'N-80',
            c95: 'C-95',
            s95: 'S-95',
            p105: 'P-105',
            p110: 'P-110'
        },
        default: 'k55',
        prereq: {
            question: 'have-diameter',
            answer: 'no'
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
            k55: 'K-55',
            l80: 'L-80',
            p110: 'P-110',
            v150: 'V-150',
            mw155: 'MW-155',
            soo140: 'SOO-140',
            soo155: 'SOO-155'
        },
        default: 'k55',
        prereq: {
            question: 'have-casing-id',
            answer: 'no'
        }
    },
    'casing-weight-k55': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '94': '94',
            '133': '133',
            '65': '65',
            '75': '75',
            '109': '109'
        },
        default: '94',
        prereq: {
            question: 'casing-grade',
            answer: 'k55'
        }
    },
    'casing-weight-l80': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '81': '81',
            '98': '98',
            '58.4': '58.4'
        },
        default: '81',
        prereq: {
            question: 'casing-grade',
            answer: 'l80'
        }
    },
    'casing-weight-p110': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '85': '85',
            '98': '98',
            '47': '47'
        },
        default: '85',
        prereq: {
            question: 'casing-grade',
            answer: 'p110'
        }
    },
    'casing-weight-v150': {
        text: 'Indicar peso nominal de la tubería de revestimiento',
        type: 'multi',
        options: {
            '38': '38',
            '41': '41',
            '46': '46'
        },
        default: '38',
        prereq: {
            question: 'casing-grade',
            answer: 'v150'
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

var recommendations = {
    '1g': {
        name: 'lpsd',
        text: 'Tecnología LPSD(Low debris and Shock)'
    },
    '2g': {
        name: 'tcp-propelente',
        text: 'Tecnología TCP Propelente-Sobrebalance'
    },
    '3g': {
        name: 'stimtube',
        text: 'Tecnología Stimtube'
    },
    '4g': {
        name: 'powr-perf',
        text: 'Tecnología POWR/PERF'
    },
    '5g': {
        name: 'perfstim',
        text: 'Tecnología PerfStim'
    },
    '6g': {
        name: 'plug-perf',
        text: 'Tecnología de completamiento de cañón insertable (Plug and Perf)'
    },
    '7g': {
        name: 'connex',
        text: 'Tecnología de cargas CONNEX'
    },
    '8g': {
        name: 'diametro-definido',
        text: 'Tecnología de Carga de diámetro de perforado definido'
    },
    '9g': {
        name: 'fragmenting-gun',
        text: 'Tecnología Fragmenting Gun'
    },
    '10g': {
        name: 'actf',
        text: 'Tecnología ACTF (Annular Coiled Tubing Fracturing)'
    },
    '11g': {
        name: 'jitp',
        text: 'Tecnología JITP (Just in Time Perforating)'
    },
    '12g': {
        name: 'reactive',
        text: 'Tecnología Reactive Liner Shaped Charges'
    },
    '13g': {
        name: 'triple-jet',
        text: 'Tecnología Triple Jet Perforating'
    },
    '14g': {
        name: 'converging',
        text: 'Tecnología Converging Focused Perforating'
    },
    '15g': {
        name: 'electrical-bar',
        text: 'Tecnología Dropping Electrical Bar Perforating'
    },
    '16g': {
        name: 'side-mounted',
        text: 'Tecnología Side Mounted Gun Perforating'
    },
    '17g': {
        name: 'hops',
        text: 'Tecnología HOPS (Horizontal Oriented Perforating Sistems)'
    },
    '1r': {
        name: 'cross-jet',
        text: 'Cross-Linked Jet fluids'
    },
    '2r': {
        name: 'ct-fracturing',
        text: 'CT Pin-Point SandJet Annular Fracturing Technique'
    },
    '3r': {
        name: 'hydro-jet',
        text: 'Hydro-Jet'
    },
    '4r': {
        name: 'radial-jet',
        text: 'Radial Jet Drilling'
    },
    '5r': {
        name: 'channel-stimulation',
        text: 'Channel Stimulation technology'
    },
    '6r': {
        name: 'slickwater',
        text: 'Slickwater Hydraulic System'
    },
    '7r': {
        name: 'cemented-plug-perf',
        text: 'Cemented Liner Plug and Perf Completion'
    },
    '8r': {
        name: 'fishbone',
        text: 'Multilateral Technology for Stimulation (Fishbone)'
    },
    '9r': {
        name: 'oh-multistage',
        text: 'Open Hole Multistage Sistem'
    },
    '10r': {
        name: 'hegf',
        text: 'Tecnología HEGF'
    }

    /* eslint-disable curly */
};function getValues(state) {
    var phi = null;
    if (state['have-phi'] === 'yes') {
        phi = state['phi'];
    } else {
        if (state['ambient'] === 'conventional') {
            if (state['reservoir'] === 'conventional') {
                phi = 17.5;
            } else if (state['reservoir'] === 'no-consolidated') {
                phi = 25;
            } else {
                if (state['fraq'] === 'yes') {
                    phi = 2.5;
                } else {
                    phi = 7.5;
                }
            }
        } else {
            if (state['multi-fraq'] === 'yes') {
                phi = 2.5;
            } else {
                phi = 12.5;
            }
        }
    }

    var ucs = null;
    if (state['have-ucs'] === 'yes') {
        ucs = state['ucs'];
    } else {
        switch (state['ucs-range']) {
            case 'lt2200':
                ucs = 2200;break;
            case 'lt4900':
                ucs = 3550;break;
            case 'lt6500':
                ucs = 5700;break;
            case 'lt13000':
                ucs = 9750;break;
            default:
                ucs = 13000;
        }
    }

    var py = state['py'];
    var pc = state['pc'];

    var a = 0.0967 * Math.pow(phi / 100, 0.428);
    var b = ucs < 30000 ? 0.7336 - 1.813e-5 * ucs : 3.33 * Math.exp(-9.55e-5 * ucs);
    var Peff = pc - a * py;
    var Fbi = ucs + b * Peff;

    var skin = null;
    if (state['type-s'] === 'damaged') {
        if (state['damage'] === 'yes') {
            skin = 10;
        } else {
            skin = 2;
        }
    } else {
        switch (state['estimulation']) {
            case 'acid':
                skin = -1;break;
            case 'hydraulic':
                skin = -3;break;
            default:
                skin = -5;
        }
    }

    var k = null;
    if (state['have-k'] === 'yes') {
        k = state['k'];
    } else {
        if (state['formation-type'] === 'sand') {
            switch (state['k-range-1']) {
                case 'lt10':
                    k = 10;break;
                case 'lt100':
                    k = 55;break;
                default:
                    k = 100;
            }
        } else {
            switch (state['k-range-2']) {
                case 'lt10':
                    k = 10;break;
                case 'lt100':
                    k = 55;break;
                case 'lt250':
                    k = 225;break;
                default:
                    k = 250;
            }
        }
    }

    var angle = null;
    if (state['have-angle'] === 'yes') {
        angle = state['angle'];
    } else {
        switch (state['angle-range']) {
            case 'low':
                angle = 5;break;
            case 'medium':
                angle = 18;break;
            default:
                angle = 30;
        }
    }

    var gasLayer = state['fluid'] === 'trifasic';

    var temperature = null;
    if (state['have-temperature']) {
        temperature = state['temperature'];
    } else {
        var depth = state['depth-2'];
        temperature = 2 * depth / 100;
    }

    var api = null;
    if (state['have-api'] === 'yes') {
        api = state['api'];
    } else {
        switch (state['oil-type']) {
            case 'e-heavy':
                api = 5;break;
            case 'heavy':
                api = 12;break;
            case 'medium':
                api = 24;break;
            case 'light':
                api = 35;break;
            default:
                api = 45;
        }
    }

    var viscOil = null;
    if (state['have-visc-oil'] === 'yes') {
        viscOil = state['visc-oil'];
    } else {
        var T = temperature;
        // Glaso
        viscOil = 3.141e10 * Math.pow(T, -3.444) * Math.pow(Math.log10(api), 10.313 * Math.log10(T) - 36.4);
    }

    var saltWater = null;
    if (state['have-salt-water'] === 'yes') {
        saltWater = state['salt-water'];
    } else {
        switch (state['salt-water-range']) {
            case 'high':
                saltWater = 5;break;
            case 'medium':
                saltWater = 15;break;
            default:
                saltWater = 23;
        }
    }

    var viscWater = null;
    if (state['have-visc-water'] === 'yes') {
        viscWater = state['visc-water'];
    } else {
        // McCain, W.D., Jr.
        var S = saltWater;
        var _T = temperature;
        var A = 109.574 - 8.40564 * S + 0.313314 * Math.pow(S, 2) + 8.72213e-3 * Math.pow(S, 3);
        var B = -1.12166 + 2.63951e-2 * S - 6.79461e-4 * Math.pow(S, 2) - 5.47119e-5 * Math.pow(S, 3) + 1.55586e-6 * Math.pow(S, 4);
        viscWater = A * Math.pow(_T, B);
    }

    var deltaH = null;
    if (state['have-interval'] === 'yes') {
        deltaH = state['interval'];
    } else {
        switch (state['interval-range']) {
            case 'lt30':
                deltaH = 30;break;
            case 'lt60':
                deltaH = 45;break;
            default:
                deltaH = 60;
        }
    }

    var dp = null;
    var dpLookup = {
        j55: {
            xr: 152,
            x: 209
        },
        k55: {
            xr: 203,
            x: 256
        },
        c55: {
            xr: 203,
            x: 261
        },
        l80: {
            xr: 203,
            x: 243
        },
        n80: {
            xr: 209,
            x: 254
        },
        c95: {
            xr: 219,
            x: 254
        },
        s95: {
            xr: 238,
            x: 294
        },
        p105: {
            xr: 254,
            x: 303
        },
        p110: {
            xr: 265,
            x: 327
        }
    };
    if (state['have-diameter'] === 'yes') {
        dp = state['diameter'];
    } else {
        var dr = state['ideal-diameter'];
        var grade = state['casing-grade-0'];
        var _dpLookup$grade = dpLookup[grade],
            xr = _dpLookup$grade.xr,
            x = _dpLookup$grade.x;

        dp = Math.sqrt((2250 + 4.2 * xr) / (2250 + 4.2 * x)) * dr;
    }

    var di = null;
    var diLookup = {
        k55: {
            '94': 19.124,
            '133': 18.730,
            '65': 15.250,
            '75': 15.124,
            '109': 14.688
        },
        l80: {
            '81': 15.010,
            '98': 11.937,
            '58.4': 8.435
        },
        p110: {
            '85': 12.159,
            '98': 11.937,
            '47': 8.681
        },
        v150: {
            '38': 5.920,
            '41': 5.820,
            '46': 5.660
        }

    };
    if (state['have-casing-id']) {
        di = state['casing-id'];
    } else {
        var weight = null;
        switch (state['casing-grade']) {
            case 'k55':
                weight = Number(state['casing-weight-k55']);
                di = diLookup['k55'][weight];
                break;
            case 'l80':
                weight = Number(state['casing-weight-l80']);
                di = diLookup['l80'][weight];
                break;
            case 'p110':
                weight = Number(state['casing-weight-p110']);
                di = diLookup['p110'][weight];
                break;
            case 'v150':
                weight = Number(state['casing-weight-v150']);
                di = diLookup['v150'][weight];
                break;
            case 'mw155':
                di = 5.920;break;
            case 'soo140':
                di = 5.660;break;
            default:
                di = 5.660;
        }
    }

    var deltaP = null;
    if (state['pressure-condition'] === 'underbalance') {
        if (state['have-underbalance-pressure'] === 'yes') {
            deltaP = state['underbalance-pressure'];
        } else {
            if (state['gas-oil'] === 'gas') {
                deltaP = 3100 / Math.pow(k, 0.37);
            } else {
                deltaP = 3000 / Math.pow(k, 0.4);
            }
        }
    } else {
        // keep as null
    }

    var pr = null;
    if (state['have-pr'] === 'yes') {
        pr = state['pr'];
    } else {
        switch (state['pr-range']) {
            case 'lt08':
                pr = 0.65;break;
            case 'lt12':
                pr = 1;break;
            default:
                pr = 1.35;
        }
    }

    return {
        phi: phi,
        ucs: ucs,
        py: py,
        Fbi: Fbi,
        skin: skin,
        k: k,
        angle: angle,

        gasLayer: gasLayer,
        viscOil: viscOil,
        viscWater: viscWater,

        deltaH: deltaH,
        dp: dp,
        di: di,
        deltaP: deltaP,
        pr: pr
    };
}
/* eslint-enable curly */

function getRecommended(state) {
    var data = getValues(state);
    // console.log(data)
    var phi = data.phi,
        ucs = data.ucs,
        py = data.py,
        Fbi = data.Fbi,
        skin = data.skin,
        k = data.k,
        angle = data.angle,
        gasLayer = data.gasLayer,
        viscOil = data.viscOil,
        viscWater = data.viscWater,
        deltaH = data.deltaH,
        dp = data.dp,
        di = data.di,
        deltaP = data.deltaP,
        pr = data.pr;


    var constraints = [{
        cond: phi < 5 && 2200 < ucs && py < 2000 && Fbi < 0 && 1 < skin && skin < 5 && k < 10 && angle < 5,
        add: ['2g', '5g', '2r']
    }, {
        cond: phi < 10 && 2200 < ucs && ucs < 4900 && 2000 < py && py < 4000 && Fbi < 0 && 1 < skin && skin < 5 && 10 < k && k < 100 && angle < 5,
        add: ['10g', '3g']
    }, {
        cond: phi < 15 && 4900 < ucs && ucs < 6500 && 4000 < py && py < 6000 && Fbi < 0 && 1 < skin && skin < 5 && 100 < k && k < 250 && angle < 5,
        add: ['11g']
    }, {
        cond: phi < 20 && 6500 < ucs && ucs < 13000 && 6000 < py && py < 8000 && Fbi < 0 && 1 < skin && skin < 5 && k > 250 && angle < 5,
        add: ['1g']
    }, {
        cond: phi < 25 && ucs > 13000 && 8000 < py && py < 10000 && Fbi < 0 && 1 < skin && skin < 5 && k > 250 && angle < 5,
        add: ['1g']
    }, {
        cond: phi < 5 && ucs < 2200 && 2000 < py && Fbi < 0 && 5 < skin && 10 < k && k < 100 && angle < 5,
        add: ['3g', '10r', '2r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 6500 && 2000 < py && py < 4000 && Fbi < 0 && 5 < skin && 10 < k && k < 100 && angle < 5,
        add: ['2g', '12g']
    }, {
        cond: 20 < phi && 6500 < ucs && ucs < 13000 && 4000 < py && py < 6000 && Fbi < 0 && 5 < skin && 250 < k && angle < 5,
        add: ['4g']
    }, {
        cond: 20 < phi && 13000 < ucs && 6000 < py && py < 8000 && Fbi < 0 && 5 < skin && 250 < k && angle < 5,
        add: ['17g', '1r']
    }, {
        cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi < 0 && 5 < skin && 10 < k && k < 100 && 5 < angle && angle < 20,
        add: ['3g', '10r', '3r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 13000 && 4000 < py && py < 8000 && Fbi < 0 && 5 < skin && 100 < k && k < 250 && 5 < angle && angle < 20,
        add: ['5g']
    }, {
        cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi < 0 && 5 < skin && 250 < k && 5 < angle && angle < 20,
        add: ['1g', '1r']
    }, {
        cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi < 0 && 5 < skin && 10 < k && k < 100 && 25 < angle,
        add: ['2g', '9g', '3r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 13000 && 4000 < py && py < 8000 && Fbi < 0 && 5 < skin && 100 < k && k < 250 && 25 < angle,
        add: ['10g']
    }, {
        cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi < 0 && 5 < skin && 250 < k && 25 < angle,
        add: ['4g']
    }, {
        cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && -3 < skin < -0.1 && 10 < k && k < 100 && 20 < angle,
        add: ['5g', '16g', '5r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 13000 && 4000 < py && py < 8000 && Fbi > 0 && -3 < skin < -0.1 && 100 < k && k < 250 && 20 < angle,
        add: ['12g', '14g']
    }, {
        cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && -3 < skin < -0.1 && 250 < k && 20 < angle,
        add: ['17g']
    }, {
        cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && skin < -3 && 10 < k && k < 100 && 20 < angle,
        add: ['16g', '14g', '5r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 13000 && 4000 < py && py < 8000 && Fbi && skin < -3 && 100 < k && k < 250 && 20 < angle,
        add: ['7g', '8g']
    }, {
        cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && skin < -3 && 250 < k && 20 < angle,
        add: ['17g']
    }, {
        cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && skin < -3 && 10 < k && k < 100 && 20 > angle,
        add: ['7g', '8g', '4r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 13000 && 4000 < py && py < 8000 && Fbi > 0 && skin < -3 && 100 < k && k < 250 && 20 > angle,
        add: ['1g']
    }, {
        cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && skin < -3 && 250 < k && 20 > angle,
        add: ['16g', '6g']
    }, {
        cond: phi < 5 && ucs < 2200 && 4000 < py && Fbi > 0 && -3 < skin < -0.1 && 10 < k && k < 100 && 20 > angle,
        add: ['7g', '8g', '4r']
    }, {
        cond: 5 < phi && phi < 20 && 2200 < ucs && ucs < 13000 && 4000 < py && py < 8000 && Fbi > 0 && -3 < skin < -0.1 && 100 < k && k < 250 && 20 > angle,
        add: ['1g']
    }, {
        cond: 20 < phi && 13000 < ucs && 8000 < py && Fbi > 0 && -3 < skin < -0.1 && 250 < k && 20 > angle,
        add: ['6g', '15g']
    }, {
        cond: !gasLayer && viscOil > viscWater,
        add: ['3g', '4g', '6r']
    }, {
        cond: gasLayer && viscOil > viscWater,
        add: ['12g', '17g', '8r']
    }, {
        cond: !gasLayer && viscOil < viscWater,
        add: ['17g', '9g', '2r']
    }, {
        cond: gasLayer && viscOil < viscWater,
        add: ['14g', '17g', '1r']
    }, {
        cond: deltaH < 30 && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || deltaP < 250) && 0.65 < pr && pr < 1,
        add: ['14g', '17g', '8r']
    }, {
        cond: 30 < deltaH && deltaH < 60 && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || deltaP < 250) && 0.65 < pr && pr < 1,
        add: ['11g']
    }, {
        cond: 60 < deltaH && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || deltaP < 250) && 0.65 < pr && pr < 1,
        add: ['9g', '16g', '7r']
    }, {
        cond: 30 < deltaH && deltaH < 60 && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || 250 < deltaP) && (!deltaP || deltaP < 750) && 0.65 < pr && pr < 1,
        add: ['6g', '17g', '8r']
    }, {
        cond: 60 < deltaH && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || 750 < deltaP) && 0.65 < pr && pr < 1,
        add: ['16g', '11g', '7r']
    }, {
        cond: deltaH < 30 && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || deltaP < 250) && 1 < pr && pr < 1.35,
        add: ['14g', '5r']
    }, {
        cond: 30 < deltaH && deltaH < 60 && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || 250 < deltaP) && (!deltaP || deltaP < 750) && 1 < pr && pr < 1.35,
        add: ['15g']
    }, {
        cond: 60 < deltaH && 5 / 16 > dp && di < 3 + 1 / 8 && (!deltaP || 750 < deltaP) && 1 < pr && pr < 1.35,
        add: ['13g', '9r']
    }, {
        cond: 30 < deltaH && 5 / 16 < dp && dp < 7 / 32 && 3 + 1 / 8 < di && di < 4 && (!deltaP || 250 < deltaP) && (!deltaP || deltaP < 500) && 1.35 < pr,
        add: ['15g']
    }, {
        cond: 30 < deltaH && deltaH < 60 && 7 / 32 < dp && 4 < di && di < 5 && (!deltaP || 500 < deltaP) && (!deltaP || deltaP < 1000) && 1.35 < pr,
        add: ['11g', '4r']
    }, {
        cond: 60 < deltaH && 7 / 32 < dp && 5 < di && (!deltaP || deltaP > 1000) && 1.35 < pr,
        add: ['4g', '10g', '6r']
    }];

    var res = new Set();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = constraints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var constraint = _step.value;

            if (constraint.cond) constraint.add.forEach(function (r) {
                return res.add(r);
            });
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

    return [].concat(_toConsumableArray(res));
}

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
        { href: 'matriz-explicaciones#' + name },
        text
    );
}

var NTPerforateMatrix = function (_Component2) {
    _inherits(NTPerforateMatrix, _Component2);

    function NTPerforateMatrix() {
        _classCallCheck(this, NTPerforateMatrix);

        var _this3 = _possibleConstructorReturn(this, (NTPerforateMatrix.__proto__ || Object.getPrototypeOf(NTPerforateMatrix)).call(this));

        var questionValues = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(questions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    name = _step2$value[0],
                    question = _step2$value[1];

                questionValues[name] = question.default;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
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
        key: 'renderRecommendation',
        value: function renderRecommendation(_ref5) {
            var name = _ref5.name,
                text = _ref5.text;

            return makeLink(name, text);
        }
    }, {
        key: 'render',
        value: function render() {
            var state = this.state;

            var shouldBeShown = function shouldBeShown(_ref6) {
                var _ref7 = _slicedToArray(_ref6, 2),
                    question = _ref7[1];

                if (!question.prereq) return true;
                var prereqQuestion = question.prereq.question;
                var answerShouldBe = question.prereq.answer;
                var answerIs = state.questionValues[prereqQuestion];
                var parentIsShown = shouldBeShown([null, questions[prereqQuestion]]);

                return answerShouldBe === answerIs && parentIsShown;
            };
            var shownQuestions = Object.entries(questions).filter(shouldBeShown);
            var shownRecommendations = getRecommended(this.state.questionValues).map(function (id) {
                return recommendations[id];
            });
            var renderedRecommendations = shownRecommendations.map(this.renderRecommendation);
            var debug = window.location.search === '?debug=true';
            var values = getValues(this.state.questionValues);

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'form',
                    null,
                    shownQuestions.map(this.renderQuestion)
                ),
                debug && _react2.default.createElement(
                    'pre',
                    null,
                    JSON.stringify(values, null, 2)
                ),
                _react2.default.createElement(_Recommendations2.default, { recommendations: renderedRecommendations })
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
