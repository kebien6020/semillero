(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

require('./app.js');

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _CriterionEditor = require('./components/CriterionEditor.jsx');

var _CriterionEditor2 = _interopRequireDefault(_CriterionEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = JSON.parse(document.getElementById('value-functions-initial-data').innerHTML);

var alternatives = data.alternatives,
    valueFunctions = data.valueFunctions,
    type = data.type,
    editMode = data.editMode;

var buttonText = (editMode ? 'Actualizar' : 'Agregar') + ' criterio';

_reactDom2.default.render(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_CriterionEditor2.default, {
        alternatives: alternatives,
        initialValueFunctions: valueFunctions,
        initialType: type
    }),
    _react2.default.createElement(
        'div',
        { className: 'submit-container' },
        _react2.default.createElement('input', { type: 'submit', value: buttonText })
    )
), document.getElementById('value-function-editor'));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app.js":2,"./components/CriterionEditor.jsx":3}],2:[function(require,module,exports){
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

var _ExtensibleInputTable = require('./ExtensibleInputTable.jsx');

var _ExtensibleInputTable2 = _interopRequireDefault(_ExtensibleInputTable);

var _CriterionTypeSelector = require('./CriterionTypeSelector.jsx');

var _CriterionTypeSelector2 = _interopRequireDefault(_CriterionTypeSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CriterionEditor = function (_React$Component) {
    _inherits(CriterionEditor, _React$Component);

    function CriterionEditor(props) {
        _classCallCheck(this, CriterionEditor);

        var _this = _possibleConstructorReturn(this, (CriterionEditor.__proto__ || Object.getPrototypeOf(CriterionEditor)).call(this, props));

        var initialType = props.initialType,
            alternatives = props.alternatives;


        var initialValueFunctions = void 0;
        if (props.initialValueFunctions) initialValueFunctions = props.initialValueFunctions;else initialValueFunctions = Object.keys(alternatives).map(function (id) {
            return { id: id };
        });

        // Add missing alternatives
        if (initialValueFunctions.length < Object.keys(alternatives).length) {
            var _loop = function (alternativeId) {
                if (alternatives.hasOwnProperty(alternativeId)) if (!initialValueFunctions.some(func => Number(func.id) === Number(alternativeId))) initialValueFunctions.push({ id: Number(alternativeId) });
            };

            // eslint-disable-next-line prefer-const
            for (let alternativeId in alternatives) {
                _loop(alternativeId);
            }
        }initialValueFunctions = initialValueFunctions.map(function (func) {
            if (!func.data || func.data.length === 0) if (initialType === 'multi') func.data = props.initialValueFunctions[0].data.map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 1),
                    name = _ref2[0];

                return [name, ''];
            });else func.data = [['', ''], ['', ''], ['', '']];
            return func;
        });

        var initialOptions = void 0;
        if (props.initialOptions) initialOptions = props.initialOptions;else if (initialType === 'multi') initialOptions = initialValueFunctions[0].data.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 1),
                x = _ref4[0];

            return x;
        });else initialOptions = ['', ''];

        _this.state = {
            type: initialType,
            options: initialOptions,
            valueFunctions: initialValueFunctions
        };
        _this.handleTypeChange = _this.handleTypeChange.bind(_this);
        _this.handleOptionsChange = _this.handleOptionsChange.bind(_this);
        _this.handleOptionAdd = _this.handleOptionAdd.bind(_this);
        _this.handleOptionRemove = _this.handleOptionRemove.bind(_this);
        _this.handleTableChange = _this.handleTableChange.bind(_this);
        _this.handleTableAddRow = _this.handleTableAddRow.bind(_this);
        _this.handleTableRemoveRow = _this.handleTableRemoveRow.bind(_this);
        _this.handleTableRowBlur = _this.handleTableRowBlur.bind(_this);
        return _this;
    }

    _createClass(CriterionEditor, [{
        key: 'handleTypeChange',
        value: function handleTypeChange(event) {
            var type = event.target.value;
            this.setState(function (state) {
                state.type = type;
                state.valueFunctions = state.valueFunctions.map(function (func) {
                    func.data = state.options.map(function (op, i) {
                        if (func.data[i]) return [op, func.data[i][1]];
                        return [op, ''];
                    });
                    return func;
                });
                return state;
            });
        }
    }, {
        key: 'handleOptionsChange',
        value: function handleOptionsChange(value, i) {
            this.setState(function (state) {
                state.options[i] = value;
                state.valueFunctions = state.valueFunctions.map(function (func) {
                    func.data = state.options.map(function (op, i) {
                        if (func.data[i]) return [op, func.data[i][1]];
                        return [op, ''];
                    });
                    return func;
                });
                return state;
            });
        }
    }, {
        key: 'handleOptionAdd',
        value: function handleOptionAdd() {
            this.setState(function (state) {
                state.options.push('');
                state.valueFunctions = state.valueFunctions.map(function (func) {
                    func.data = state.options.map(function (op, i) {
                        if (func.data[i]) return [op, func.data[i][1]];
                        return [op, ''];
                    });
                    return func;
                });
                return state;
            });
        }
    }, {
        key: 'handleOptionRemove',
        value: function handleOptionRemove() {
            if (this.state.options.length > 1) this.setState(function (state) {
                state.options.pop();
                state.valueFunctions = state.valueFunctions.map(function (func) {
                    func.data = state.options.map(function (op, i) {
                        if (func.data[i]) return [op, func.data[i][1]];
                        return [op, ''];
                    });
                    return func;
                });
                return state;
            });
        }
    }, {
        key: 'handleTableChange',
        value: function handleTableChange(value, i, j, tag) {
            this.setState(function (state) {
                state.valueFunctions[tag].data[i][j] = value;
                return state;
            });
        }
    }, {
        key: 'handleTableAddRow',
        value: function handleTableAddRow(tag) {
            this.setState(function (state) {
                state.valueFunctions[tag].data.push(['', '']);
                return state;
            });
        }
    }, {
        key: 'handleTableRemoveRow',
        value: function handleTableRemoveRow(tag) {
            this.setState(function (state) {
                state.valueFunctions[tag].data.pop();
                return state;
            });
        }
    }, {
        key: 'handleTableRowBlur',
        value: function handleTableRowBlur(i, tag) {
            this.setState(function (state) {
                var typeIsNumeric = state.type === 'numeric';
                var newData = state.valueFunctions[tag].data.map(function (_ref5) {
                    var _ref6 = _slicedToArray(_ref5, 2),
                        x = _ref6[0],
                        y = _ref6[1];

                    var newX = typeIsNumeric && isNaN(Number(x)) ? '' : x;
                    var newY = isNaN(Number(y)) ? '' : y;
                    return [newX, newY];
                });
                state.valueFunctions[tag].data = newData;
                return state;
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var alternatives = this.props.alternatives;
            var _state = this.state,
                valueFunctions = _state.valueFunctions,
                type = _state.type,
                options = _state.options;

            var editors = valueFunctions.map(function (valueFunction, i) {
                var content = void 0;
                if (type === 'numeric') content = valueFunction.data;else content = options.map(function (o, i) {
                    var score = valueFunction.data[i] ? valueFunction.data[i][1] : '';
                    return [o, score];
                });
                return _react2.default.createElement(_ExtensibleInputTable2.default, {
                    key: i,
                    tag: i,
                    titles: ['Valor', 'Puntaje'],
                    content: content,
                    mainTitle: alternatives[valueFunction.id].name,
                    inputNamePrefix: valueFunction.id + '-',
                    fixedColumns: type === 'multi' ? [0] : [],
                    onChange: _this2.handleTableChange,
                    onAddRow: _this2.handleTableAddRow,
                    onRemoveRow: _this2.handleTableRemoveRow,
                    onRowBlur: _this2.handleTableRowBlur
                });
            });

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_CriterionTypeSelector2.default, {
                    type: this.state.type,
                    options: this.state.options,
                    onTypeChange: this.handleTypeChange,
                    onOptionsChange: this.handleOptionsChange,
                    onOptionAdd: this.handleOptionAdd,
                    onOptionRemove: this.handleOptionRemove
                }),
                editors
            );
        }
    }]);

    return CriterionEditor;
}(_react2.default.Component);

exports.default = CriterionEditor;


CriterionEditor.propTypes = {
    initialValueFunctions: _react2.default.PropTypes.array,
    initialOptions: _react2.default.PropTypes.array,
    initialType: _react2.default.PropTypes.string,
    alternatives: _react2.default.PropTypes.object.isRequired
};

CriterionEditor.defaultProps = {
    initialType: 'numeric'
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./CriterionTypeSelector.jsx":4,"./ExtensibleInputTable.jsx":5}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CriterionTypeSelector;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _ExtensibleInputTable = require('./ExtensibleInputTable.jsx');

var _ExtensibleInputTable2 = _interopRequireDefault(_ExtensibleInputTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CriterionTypeSelector(props) {
    var type = props.type,
        options = props.options,
        onTypeChange = props.onTypeChange,
        onOptionsChange = props.onOptionsChange,
        onOptionAdd = props.onOptionAdd,
        onOptionRemove = props.onOptionRemove;

    var table = null;
    if (type === 'multi') table = _react2.default.createElement(_ExtensibleInputTable2.default, {
        titles: ['Opciones para el criterio'],
        onChange: onOptionsChange,
        onAddRow: onOptionAdd,
        onRemoveRow: onOptionRemove,
        content: options.map(function (o) {
            return [o];
        })
    });

    return _react2.default.createElement(
        'div',
        { className: 'form-group' },
        _react2.default.createElement(
            'label',
            null,
            'Tipo'
        ),
        _react2.default.createElement(
            'select',
            { name: 'type', value: type, onChange: onTypeChange },
            _react2.default.createElement(
                'option',
                { value: 'numeric' },
                'Numerico'
            ),
            _react2.default.createElement(
                'option',
                { value: 'multi' },
                'Selecci\xF3n m\xFAltiple'
            )
        ),
        table
    );
}

CriterionTypeSelector.propTypes = {
    type: _react2.default.PropTypes.string.isRequired,
    options: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),
    onTypeChange: _react2.default.PropTypes.func.isRequired,
    onOptionsChange: _react2.default.PropTypes.func.isRequired,
    onOptionAdd: _react2.default.PropTypes.func.isRequired,
    onOptionRemove: _react2.default.PropTypes.func.isRequired
};

CriterionTypeSelector.defaultProps = {
    options: []
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ExtensibleInputTable.jsx":5}],5:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ExtensibleInputTable;

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filledArray(data, size) {
    return Array(size).fill(data);
}

function arrayContains(value, arr) {
    return arr.indexOf(value) !== -1;
}

function ExtensibleInputTable(props) {
    var fixedColumns = props.fixedColumns,
        inputNamePrefix = props.inputNamePrefix,
        _onChange = props.onChange,
        onRowBlur = props.onRowBlur,
        titles = props.titles,
        mainTitle = props.mainTitle,
        onAddRow = props.onAddRow,
        onRemoveRow = props.onRemoveRow,
        tag = props.tag,
        content = props.content;


    var header = mainTitle ? _react2.default.createElement(
        "tr",
        null,
        _react2.default.createElement(
            "th",
            { colSpan: "2" },
            mainTitle
        )
    ) : null;
    var ths = titles.map(function (title, i) {
        return _react2.default.createElement(
            "th",
            { key: i },
            title
        );
    });
    var rows = content.map(function (row, i) {
        return _react2.default.createElement(
            "tr",
            { key: i },
            row.map(function (value, j) {
                if (arrayContains(j, fixedColumns)) return _react2.default.createElement(
                    "td",
                    { key: j },
                    _react2.default.createElement(
                        "span",
                        null,
                        value
                    ),
                    _react2.default.createElement("input", {
                        type: "hidden",
                        name: "" + inputNamePrefix + i + "-" + j,
                        value: value
                    })
                );else return _react2.default.createElement(
                    "td",
                    { key: j },
                    _react2.default.createElement("input", {
                        type: "text",
                        name: "" + inputNamePrefix + i + "-" + j,
                        value: value,
                        required: "required",
                        onChange: function onChange(event) {
                            return _onChange(event.target.value, i, j, tag);
                        },
                        onBlur: function onBlur() {
                            if (j === row.length - 1) onRowBlur(i, tag);
                        }
                    })
                );
            })
        );
    });
    return _react2.default.createElement(
        "table",
        null,
        _react2.default.createElement(
            "thead",
            null,
            header,
            _react2.default.createElement(
                "tr",
                null,
                ths
            )
        ),
        _react2.default.createElement(
            "tbody",
            null,
            rows,
            _react2.default.createElement(
                "tr",
                null,
                _react2.default.createElement(
                    "td",
                    { colSpan: "2" },
                    _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            className: "plus-button",
                            onClick: function onClick() {
                                return onAddRow(tag);
                            }
                        },
                        _react2.default.createElement("span", { className: "glyphicon glyphicon-plus" }),
                        "Adicionar Fila"
                    ),
                    _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            className: "minus-button",
                            onClick: function onClick() {
                                return onRemoveRow(tag);
                            }
                        },
                        _react2.default.createElement("span", { className: "glyphicon glyphicon-minus" }),
                        "Eliminar Fila"
                    )
                )
            )
        )
    );
}

ExtensibleInputTable.propTypes = {
    tag: _react2.default.PropTypes.any,
    titles: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string).isRequired,
    content: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)),
    mainTitle: _react2.default.PropTypes.string,
    inputNamePrefix: _react2.default.PropTypes.string,
    fixedColumns: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
    // events
    onChange: _react2.default.PropTypes.func.isRequired,
    onRowBlur: _react2.default.PropTypes.func,
    onAddRow: _react2.default.PropTypes.func.isRequired,
    onRemoveRow: _react2.default.PropTypes.func.isRequired
};

ExtensibleInputTable.defaultProps = {
    content: null,
    mainTitle: null,
    inputNamePrefix: '',
    fixedColumns: [],
    // events (by default do nothing)
    onRowBlur: function onRowBlur() {}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);

//# sourceMappingURL=als_matrix_criterion_form.js.map
