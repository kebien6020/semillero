(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

require('./app');

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _AlsMatrix = require('./components/AlsMatrix.jsx');

var _AlsMatrix2 = _interopRequireDefault(_AlsMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _JSON$parse = JSON.parse(document.getElementById('matrix-data').innerHTML),
    criteria = _JSON$parse.criteria,
    alternatives = _JSON$parse.alternatives;

_reactDom2.default.render(_react2.default.createElement(_AlsMatrix2.default, { criteria: criteria, alternatives: alternatives }), document.getElementById('matrix'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":2,"./components/AlsMatrix.jsx":3}],2:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

$('.success-panel, .error-panel').addClass('alert fade in');
$().alert();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlsMatrix = function (_React$Component) {
    _inherits(AlsMatrix, _React$Component);

    function AlsMatrix(props) {
        _classCallCheck(this, AlsMatrix);

        var _this = _possibleConstructorReturn(this, (AlsMatrix.__proto__ || Object.getPrototypeOf(AlsMatrix)).call(this, props));

        var _this$props = _this.props,
            criteria = _this$props.criteria,
            alternatives = _this$props.alternatives;

        var answers = criteria.reduce(function (arr, criterion) {
            if (criterion.type === 'multi') arr[criterion.id] = criterion.valueFunctions[0].data[0][0];else arr[criterion.id] = '';

            return arr;
        }, []);

        _this.alternatives = [];
        for (var alternativeId in alternatives) {
            if (alternatives.hasOwnProperty(alternativeId)) _this.alternatives[alternativeId] = {
                id: alternativeId,
                name: alternatives[alternativeId].name,
                newTech: alternatives[alternativeId].newTech.split('\n')
            };
        }_this.criteria = criteria.reduce(function (arr, criterion) {
            arr[criterion.id] = {};
            if (criterion.type === 'multi') arr[criterion.id].options = criterion.valueFunctions[0].data.map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 1),
                    x = _ref2[0];

                return x;
            });
            arr[criterion.id].name = criterion.name;
            arr[criterion.id].type = criterion.type;
            arr[criterion.id].weight = criterion.weight;
            arr[criterion.id].id = criterion.id;
            arr[criterion.id].valueFunctions = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = criterion.valueFunctions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var func = _step.value;

                    arr[criterion.id].valueFunctions[func.id] = func;
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

            return arr;
        }, []);

        _this.state = {
            answers: answers,
            showTable: false
        };

        _this.handleShowTableChange = _this.handleShowTableChange.bind(_this);
        _this.handleAnswerChange = _this.handleAnswerChange.bind(_this);
        _this.calcScore = _this.calcScore.bind(_this);
        _this.interpolateIn = _this.interpolateIn.bind(_this);
        _this.renderInput = _this.renderInput.bind(_this);
        return _this;
    }

    _createClass(AlsMatrix, [{
        key: 'handleShowTableChange',
        value: function handleShowTableChange(event) {
            var checked = event.target.checked;
            this.setState(function (state) {
                state.showTable = checked;
                return state;
            });
        }
    }, {
        key: 'handleAnswerChange',
        value: function handleAnswerChange(value, criterionId) {
            this.setState(function (state) {
                state.answers[criterionId] = value;
                return state;
            });
        }
    }, {
        key: 'interpolate',
        value: function interpolate(value, x1, y1, x2, y2) {
            return y1 + (value - x1) * (y2 - y1) / (x2 - x1);
        }
    }, {
        key: 'interpolateIn',
        value: function interpolateIn(value, data) {
            if (data.length <= 1) {
                return 'Funcion valor incompleta';
            } else if (value < data[0][0]) {
                return 'Fuera de rango (Valor especificado muy bajo)';
            } else if (value > data[data.length - 1][0]) {
                return 'Fuera de rango (Valor especificado muy alto)';
            } else {
                var currentPoint = 0;
                while (data[currentPoint + 1][0] < value) {
                    ++currentPoint;
                }return this.interpolate(value, data[currentPoint][0], data[currentPoint][1], data[currentPoint + 1][0], data[currentPoint + 1][1]);
            }
        }
    }, {
        key: 'calcScore',
        value: function calcScore(criterion, alternative, answer) {
            var data = criterion.valueFunctions[alternative.id].data;
            if (criterion.type === 'multi') return Number(data.filter(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 1),
                    x = _ref4[0];

                return x === answer;
            })[0][1]);
            if (answer === '' || isNaN(Number(answer))) return null;
            return this.interpolateIn(Number(answer), data.map(function (point) {
                return [Number(point[0]), Number(point[1])];
            }));
        }
    }, {
        key: 'calcResults',
        value: function calcResults(scores, weights) {
            // util
            var sum = function sum(a, b) {
                return a + b;
            };
            var min = function min(arr) {
                return Math.min.apply(Math, _toConsumableArray(arr));
            };
            var max = function max(arr) {
                return Math.max.apply(Math, _toConsumableArray(arr));
            };
            var flat = function flat(arr) {
                return arr.reduce(function (acc, v) {
                    return acc.concat(v);
                }, []);
            };
            var isNumber = function isNumber(v) {
                return !isNaN(Number(v));
            };
            // Step 1: Scores - Provided as param
            // Step 2: Normalize
            var R = scores.map(function (row) {
                return row.map(function (cell) {
                    return cell / row.reduce(sum, 0);
                });
            });
            // Step 3: weight
            var normalizedWeights = weights.map(function (w) {
                return w / weights.reduce(sum, 0);
            });
            var T = R.map(function (row, criterionId) {
                return row.map(function (cell) {
                    return cell * normalizedWeights[criterionId];
                });
            });
            // Step 4: best and worse condition
            var twj = min(flat(T).filter(isNumber));
            var tbj = max(flat(T).filter(isNumber));

            // Step 5: distances
            var alternativeIds = scores[scores.length - 1].map(function (cell, alternativeId) {
                return alternativeId;
            });
            var diw = alternativeIds.map(function (alternativeId) {
                return T.map(function (row) {
                    return row[alternativeId];
                }).filter(isNumber).reduce(function (acc, cell) {
                    return acc + (cell - twj) * (cell - twj);
                }, 0);
            }).map(Math.sqrt);

            var dib = alternativeIds.map(function (alternativeId) {
                return T.map(function (row) {
                    return row[alternativeId];
                }).filter(isNumber).reduce(function (acc, cell) {
                    return acc + (cell - tbj) * (cell - tbj);
                }, 0);
            }).map(Math.sqrt);

            // Step 6: Calc siw
            var siw = diw.map(function (dw, i) {
                return dw / (dw + dib[i]);
            });

            return siw.map(function (sw, i) {
                return {
                    alternativeId: i,
                    score: sw
                };
            }).sort(function (left, right) {
                return right.score - left.score;
            });
        }
    }, {
        key: 'renderInput',
        value: function renderInput(criterion, answer) {
            var _this2 = this;

            if (criterion.type === 'numeric') {
                return _react2.default.createElement('input', {
                    type: 'text',
                    id: 'input-' + criterion.id,
                    name: 'input-' + criterion.id,
                    placeholder: criterion.name,
                    value: answer,
                    onChange: function onChange(event) {
                        return _this2.handleAnswerChange(event.target.value, criterion.id);
                    }
                });
            } else {
                var options = criterion.options.map(function (op) {
                    return _react2.default.createElement(
                        'option',
                        { value: op, key: op },
                        op
                    );
                });
                return _react2.default.createElement(
                    'select',
                    {
                        id: 'input-' + criterion.id,
                        name: 'input-' + criterion.id,
                        value: answer,
                        onChange: function onChange(event) {
                            return _this2.handleAnswerChange(event.target.value, criterion.id);
                        }
                    },
                    options
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var criteria = this.criteria,
                alternatives = this.alternatives;
            var _state = this.state,
                answers = _state.answers,
                showTable = _state.showTable;

            var formGroups = answers.map(function (answer, id) {
                var criterion = criteria[id];
                return _react2.default.createElement(
                    'div',
                    { className: 'form-group', key: id },
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'input-' + id },
                        criterion.name
                    ),
                    _this3.renderInput(criterion, answer)
                );
            });

            var scores = [];
            criteria.forEach(function (criterion) {
                scores[criterion.id] = [];
                alternatives.forEach(function (alternative) {
                    scores[criterion.id][alternative.id] = _this3.calcScore(criterion, alternative, answers[criterion.id]);
                });
            });

            var scoreTable = null;
            if (showTable) scoreTable = _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                    'thead',
                    null,
                    _react2.default.createElement(
                        'tr',
                        null,
                        _react2.default.createElement('td', null),
                        alternatives.map(function (alternative, id) {
                            return _react2.default.createElement(
                                'th',
                                { key: id },
                                alternative.name
                            );
                        })
                    )
                ),
                _react2.default.createElement(
                    'tbody',
                    null,
                    criteria.map(function (criterion) {
                        return _react2.default.createElement(
                            'tr',
                            { key: criterion.id },
                            _react2.default.createElement(
                                'th',
                                null,
                                criterion.name
                            ),
                            alternatives.map(function (alternative) {
                                return _react2.default.createElement(
                                    'td',
                                    { key: alternative.id },
                                    scores[criterion.id][alternative.id]
                                );
                            })
                        );
                    })
                )
            );
            var weights = criteria.map(function (criterion) {
                return criterion.weight;
            });
            var ruledOut = [];
            scores.forEach(function (row) {
                row.forEach(function (cell, alternativeId) {
                    if (typeof cell === 'string') ruledOut.push(alternativeId);
                });
            });
            var filteredScores = scores.map(function (row) {
                ruledOut.forEach(function (id) {
                    delete row[id];
                });
                return row;
            });
            var results = this.calcResults(filteredScores, weights);
            var listItems = results.map(function (r, i) {
                return _react2.default.createElement(
                    'li',
                    { key: i },
                    alternatives[r.alternativeId].name,
                    ' (Puntaje TOPSIS = ' + r.score.toFixed(4) + ')'
                );
            });
            if (Object.keys(listItems).length === 0) listItems.push(_react2.default.createElement(
                'li',
                { key: 'n/a' },
                'Ninguna. Revise la tabla de puntajes, ya que todos los sistemas fueron excluidos por rangos operativos.'
            ));
            var recommendations = _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h2',
                    null,
                    'Recomendaciones'
                ),
                _react2.default.createElement(
                    'ol',
                    null,
                    listItems
                )
            );

            var filteredAlternatives = alternatives.filter(function (alternative) {
                return ruledOut.indexOf(alternative.id) === -1;
            });

            var newTechList = filteredAlternatives.map(function (alternative) {
                return alternative.newTech.map(function (item) {
                    return _react2.default.createElement(
                        'li',
                        { key: item },
                        _react2.default.createElement(
                            'strong',
                            null,
                            alternative.name
                        ),
                        ': ',
                        item
                    );
                });
            });

            var newTech = _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h2',
                    null,
                    'Nuevas tecnolog\xEDas asociadas a las recomendaciones'
                ),
                _react2.default.createElement(
                    'ul',
                    null,
                    newTechList
                )
            );
            return _react2.default.createElement(
                'form',
                { className: 'form-3-9' },
                formGroups,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'label',
                        null,
                        _react2.default.createElement('input', {
                            type: 'checkbox',
                            checked: showTable,
                            onChange: this.handleShowTableChange
                        }),
                        'Mostrar tabla de puntajes'
                    )
                ),
                scoreTable,
                recommendations,
                newTech
            );
        }
    }]);

    return AlsMatrix;
}(_react2.default.Component);

exports.default = AlsMatrix;


AlsMatrix.propTypes = {
    criteria: _react2.default.PropTypes.array.isRequired,
    alternatives: _react2.default.PropTypes.object.isRequired
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

//# sourceMappingURL=als_matrix.js.map
