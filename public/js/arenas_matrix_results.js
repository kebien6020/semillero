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

require('./app.js');

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Plot options
// This is passed to flot jQuery plugin
var plot_options = {
    xaxis: {
        // Log scale on x axis
        transform: function transform(v) {
            return v > 0 ? Math.log10(v) : 0;
        },
        ticks: function ticks(axis) {
            var res = [];
            for (var i = 0; i < axis.max; i += 100) {
                if (i <= 500) res.push(i);else if (i % 200 === 0) res.push(i);
            }return res;
        }
    },
    yaxis: {
        min: 0,
        max: 100,
        ticks: 10
    },
    grid: {
        labelMargin: 10,
        margin: {
            top: 10,
            bottom: 20,
            left: 20
        }
    },
    colors: ['blue', 'gray', 'gray', 'gray', 'gray', 'gray']

    // Module global, jQuery DOM element where the plot is going to be drawn
};var $plot = null;

// Called when the module loads (see end of file)
function init() {
    cacheDom();
    getData().then(renderPlot, handleError);
}

function cacheDom() {
    $plot = (0, _jquery2.default)('.plot');
}

// Initiates a JSON request to the server in order to get the plot data
function getData() {
    var id = $plot.data('sampleGroupId');
    return _jquery2.default.getJSON('/api/arenas/get_matrix_plot/' + id);
}

// Renders the plot on the screen using flot jQuery plugin.
// data is the JSON response (already parsed)
function renderPlot(data) {
    var min = Math.min(data.points[0].grain_size, data.x10);
    var x10_line = makeLines(data.x10, 10, min);
    var x60_line = makeLines(data.x60, 60, min);
    var x90_line = makeLines(data.x90, 90, min);
    var x50_line = makeLines(data.x50, 50, min);
    var x30_line = makeLines(data.x30, 30, min);
    var series = [flattenPoints(data.points), x10_line, x60_line, x90_line, x50_line, x30_line];

    _jquery2.default.plot($plot, series, plot_options);

    setupAxes();
}

// Makes a ┐-shaped pair of lines
function makeLines(x, y, min) {
    return [[min, y], [x, y], [x, 0]];
}

// Transform [{grain_size: x1, cummulative_rel_freq: y1},...] into [[x1,y1],...]
function flattenPoints(points) {
    var res = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var point = _step.value;

            res.push([point.grain_size, point.cummulative_rel_freq]);
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

    return res;
}

// Setup the plot axes labels after the plot is drawn
// The yaxis label is rotated and centrated vertically
function setupAxes() {
    // yaxis
    var $yaxis = (0, _jquery2.default)('<div class=\'axisLabel yaxisLabel\'></div>');
    $yaxis.text('Porcentaje Acumulado en Peso (%)').appendTo($plot);

    // Since CSS transforms use the top-left corner of the label as the transform origin,
    // we need to center the y-axis label by shifting it down by half its width.
    // Subtract 20 to factor the chart's bottom margin into the centering.
    $yaxis.css('margin-top', $yaxis.width() / 2 - 20);

    // xaxis
    (0, _jquery2.default)('<div class=\'axisLabel xaxisLabel\'></div>').text('Tamaño partícula (Micras)').appendTo($plot);
}

// Called when the JSON request fails
function handleError() {
    // TODO: print error to DOM
    alert('Falló la carga de datos para crear el gráfico');
}

init();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app.js":1}]},{},[2]);

//# sourceMappingURL=arenas_matrix_results.js.map
