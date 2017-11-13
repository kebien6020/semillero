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
exports.default = flotAddLabels;

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function flotAddLabels(plot) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$xOffset = _ref.xOffset,
        xOffset = _ref$xOffset === undefined ? 0 : _ref$xOffset,
        _ref$yOffset = _ref.yOffset,
        yOffset = _ref$yOffset === undefined ? -25 : _ref$yOffset,
        _ref$fadeIn = _ref.fadeIn,
        fadeIn = _ref$fadeIn === undefined ? false : _ref$fadeIn,
        process = _ref.process;

    // Adapted from http://stackoverflow.com/a/2601155
    _jquery2.default.each(plot.getData()[0].data, function (i, point) {
        var o = plot.pointOffset({ x: point[0], y: point[1] });
        var value = point[1];
        if (process) value = process.call(null, value);
        var $label = (0, _jquery2.default)('<div class="data-point-label">' + value + '</div>');

        $label.css({
            position: 'absolute',
            left: o.left + xOffset,
            top: o.top + yOffset,
            transform: 'translateX(-50%)' // Center
        });
        if (fadeIn) $label.css({ display: 'none' });

        $label.appendTo(plot.getPlaceholder());

        if (fadeIn) $label.fadeIn('slow');
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = plotYearAndType;

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _throttle = require('./throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _flot_add_labels = require('./flot_add_labels');

var _flot_add_labels2 = _interopRequireDefault(_flot_add_labels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Returns a function that when called graphs the plot
var makePlotFn = function makePlotFn(data, $targetElem, color) {
    // Map the data to the format flot requires
    var series = [{
        // Replace xcoord with serial number
        data: data.map(function (d, i) {
            return [i, d[1]];
        })
    }];

    // Setup ticks
    var ticks = data.map(function (d, i) {
        return [i, d[0]];
    });

    // Flot's options object
    var options = {
        series: {
            bars: { show: true }
        },
        bars: {
            align: 'center',
            barWidth: 0.5
        },
        legend: {
            show: false
        },
        xaxis: {
            ticks: ticks,
            min: -0.5,
            max: ticks.length - 1 + 0.5
        }

        // Setup graph color if provided
    };if (color) options.colors = [color];

    // Sum of all ycoords
    var sum = data.map(function (d) {
        return d[1];
    }).reduce(function (a, b) {
        return a + b;
    });
    // Utility function
    var percentage = function percentage(frac) {
        return (frac * 100).toFixed(1) + '%';
    };
    // Wrap plot action in a function
    var plotFn = function plotFn() {
        var plot = _jquery2.default.plot($targetElem, series, options);

        (0, _flot_add_labels2.default)(plot, {
            yOffset: -15,
            process: function process(value) {
                return value + ' (' + percentage(value / sum) + ')';
            }
        });
    };

    return plotFn;
}; /**
    * Plot year and type on #year-plot, #type-plot
    * using data from #plot-data in the form of
    * {
    *    byYear: [year data],
    *    byType: [type data],
    *    basin: [basin name]
    * }
    */
function plotYearAndType() {
    var colorLookup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // Query the DOM elements we are going to need
    var $yearPlot = document.getElementById('year-plot');
    var $typePlot = document.getElementById('type-plot');
    var $plotData = document.getElementById('plot-data');

    // Obtain the plot data from the DOM
    var serverData = JSON.parse($plotData.innerHTML);

    // Lookup the color to use from the basin name
    //
    // If the color is not found it will be simply undefined
    // and makePlotFn will simply ignore it for being a falsy
    // value and use default flot coloring
    var color = colorLookup[serverData.basin];

    // Make the plot functions
    var plotYears = makePlotFn(serverData.byYear, $yearPlot, color);
    var plotType = makePlotFn(serverData.byType, $typePlot, color);

    // Use them
    plotYears();
    plotType();

    // Create custom throttled resize event
    (0, _throttle2.default)('resize', 'tResize');

    // Re-plot on tResize
    window.addEventListener('tResize', plotYears);
    window.addEventListener('tResize', plotType);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./flot_add_labels":2,"./throttle":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Create custom throttled events that only occur once per animation frame
// Code from https://developer.mozilla.org/en-US/docs/Web/Events/resize
var throttle = function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function func() {
        if (running) return;
        running = true;
        requestAnimationFrame(function () {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
};

exports.default = throttle;

},{}],5:[function(require,module,exports){
'use strict';

require('./app');

var _plot_year_and_type = require('./modules/plot_year_and_type');

var _plot_year_and_type2 = _interopRequireDefault(_plot_year_and_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _plot_year_and_type2.default)({
    'LLANOS ORIENTALES': '#edc240',
    'PUTUMAYO': '#afd8f8',
    'CATATUMBO': '#cb4b4b',
    'VSM': '#4da74d',
    'VMM': '#9440ed'
});

},{"./app":1,"./modules/plot_year_and_type":3}]},{},[5]);

//# sourceMappingURL=pipe_basin_detail.js.map
