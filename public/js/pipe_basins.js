(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

$('.success-panel, .error-panel').addClass('alert fade in');
$().alert();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, define, require) {
"use strict";

/*
 * Flot plugin to order bars side by side.
 * 
 * Released under the MIT license by Benjamin BUFFET, 20-Sep-2010.
 *
 * This plugin is an alpha version.
 *
 * To activate the plugin you must specify the parameter "order" for the specific serie :
 *
 *  $.plot($("#placeholder"), [{ data: [ ... ], bars :{ order = null or integer }])
 *
 * If 2 series have the same order param, they are ordered by the position in the array;
 *
 * The plugin adjust the point by adding a value depanding of the barwidth
 * Exemple for 3 series (barwidth : 0.1) :
 *
 *          first bar décalage : -0.15
 *          second bar décalage : -0.05
 *          third bar décalage : 0.05
 *
 */

(function ($) {
    function init(plot) {
        var orderedBarSeries;
        var nbOfBarsToOrder;
        var borderWidth;
        var borderWidthInXabsWidth;
        var pixelInXWidthEquivalent = 1;
        var isHorizontal = false;

        /*
         * This method add shift to x values
         */
        function reOrderBars(plot, serie, datapoints) {
            var shiftedPoints = null;

            if (serieNeedToBeReordered(serie)) {
                checkIfGraphIsHorizontal(serie);
                calculPixel2XWidthConvert(plot);
                retrieveBarSeries(plot);
                calculBorderAndBarWidth(serie);

                if (nbOfBarsToOrder >= 2) {
                    var position = findPosition(serie);
                    var decallage = 0;

                    var centerBarShift = calculCenterBarShift();

                    if (isBarAtLeftOfCenter(position)) {
                        decallage = -1 * sumWidth(orderedBarSeries, position - 1, Math.floor(nbOfBarsToOrder / 2) - 1) - centerBarShift;
                    } else {
                        decallage = sumWidth(orderedBarSeries, Math.ceil(nbOfBarsToOrder / 2), position - 2) + centerBarShift + borderWidthInXabsWidth * 2;
                    }

                    shiftedPoints = shiftPoints(datapoints, serie, decallage);
                    datapoints.points = shiftedPoints;
                }
            }
            return shiftedPoints;
        }

        function serieNeedToBeReordered(serie) {
            return serie.bars != null && serie.bars.show && serie.bars.order != null;
        }

        function calculPixel2XWidthConvert(plot) {
            var gridDimSize = isHorizontal ? plot.getPlaceholder().innerHeight() : plot.getPlaceholder().innerWidth();
            var minMaxValues = isHorizontal ? getAxeMinMaxValues(plot.getData(), 1) : getAxeMinMaxValues(plot.getData(), 0);
            var AxeSize = minMaxValues[1] - minMaxValues[0];
            pixelInXWidthEquivalent = AxeSize / gridDimSize;
        }

        function getAxeMinMaxValues(series, AxeIdx) {
            var minMaxValues = new Array();
            for (var i = 0; i < series.length; i++) {
                minMaxValues[0] = series[i].data[0][AxeIdx];
                minMaxValues[1] = series[i].data[series[i].data.length - 1][AxeIdx];
            }
            return minMaxValues;
        }

        function retrieveBarSeries(plot) {
            orderedBarSeries = findOthersBarsToReOrders(plot.getData());
            nbOfBarsToOrder = orderedBarSeries.length;
        }

        function findOthersBarsToReOrders(series) {
            var retSeries = new Array();

            for (var i = 0; i < series.length; i++) {
                if (series[i].bars.order != null && series[i].bars.show) {
                    retSeries.push(series[i]);
                }
            }

            return retSeries.sort(sortByOrder);
        }

        function sortByOrder(serie1, serie2) {
            var x = serie1.bars.order;
            var y = serie2.bars.order;
            return x < y ? -1 : x > y ? 1 : 0;
        }

        function calculBorderAndBarWidth(serie) {
            borderWidth = serie.bars.lineWidth ? serie.bars.lineWidth : 2;
            borderWidthInXabsWidth = borderWidth * pixelInXWidthEquivalent;
        }

        function checkIfGraphIsHorizontal(serie) {
            if (serie.bars.horizontal) {
                isHorizontal = true;
            }
        }

        function findPosition(serie) {
            var pos = 0;
            for (var i = 0; i < orderedBarSeries.length; ++i) {
                if (serie == orderedBarSeries[i]) {
                    pos = i;
                    break;
                }
            }

            return pos + 1;
        }

        function calculCenterBarShift() {
            var width = 0;

            if (nbOfBarsToOrder % 2 != 0) width = orderedBarSeries[Math.ceil(nbOfBarsToOrder / 2)].bars.barWidth / 2;

            return width;
        }

        function isBarAtLeftOfCenter(position) {
            return position <= Math.ceil(nbOfBarsToOrder / 2);
        }

        function sumWidth(series, start, end) {
            var totalWidth = 0;

            for (var i = start; i <= end; i++) {
                totalWidth += series[i].bars.barWidth + borderWidthInXabsWidth * 2;
            }

            return totalWidth;
        }

        function shiftPoints(datapoints, serie, dx) {
            var ps = datapoints.pointsize;
            var points = datapoints.points;
            var j = 0;
            for (var i = isHorizontal ? 1 : 0; i < points.length; i += ps) {
                points[i] += dx;
                //Adding the new x value in the serie to be abble to display the right tooltip value,
                //using the index 3 to not overide the third index.
                serie.data[j][3] = points[i];
                j++;
            }

            return points;
        }

        plot.hooks.processDatapoints.push(reOrderBars);
    }

    var options = {
        series: {
            bars: { order: null } // or number/string
        }
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: "orderBars",
        version: "0.2"
    });
})(jQuery);

}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
"use strict";

module.exports = function (array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
};

},{}],4:[function(require,module,exports){
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
(function (global){
'use strict';

require('./app');

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

require('jquery.flot.orderBars');

var _throttle = require('./modules/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _array_unique = require('./modules/array_unique');

var _array_unique2 = _interopRequireDefault(_array_unique);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Query the DOM elements we are going to need
// Allows for multi-series bar graph
var $plot = document.getElementById('plot');
var $legendContainer = document.getElementById('plot-legend');
var $plotData = document.getElementById('plot-data');

// Obtain the plot data from the DOM
var data = JSON.parse($plotData.innerHTML);

// Map the data to the format flot requires
var series = data.map(function (d) {
    return {
        bars: { order: true }, // Enable the orderBars plugin
        label: d.basin,
        data: d.occurrences
    };
});

// Utility functions for finding min and max
var flatMap = function flatMap(arr, fn) {
    return Array.prototype.concat.apply([], arr.map(fn));
};
var min = function min(arr) {
    return Math.min.apply(null, arr);
};
var max = function max(arr) {
    return Math.max.apply(null, arr);
};

// Concat all datapoints together and then map to the x coordinate
var years = flatMap(data, function (d) {
    return d.occurrences;
}).map(function (point) {
    return point[0];
});

var minyear = min(years);
var maxyear = max(years);

// Flot's options object
var options = {
    series: {
        bars: { show: true }
    },
    bars: {
        // 0.3 is the space between bars from different datapoints
        barWidth: (1 - 0.3) / series.length
    },
    legend: {
        // Horizontal legend
        noColumns: 0,
        container: $legendContainer
    },
    xaxis: {
        min: minyear - 1,
        max: maxyear + 1,
        ticks: (0, _array_unique2.default)(years)
    }
};

// Wrap plot action in a function
var plot = function plot() {
    _jquery2.default.plot($plot, series, options);
};

// Create custom throttled resize event
(0, _throttle2.default)('resize', 'tResize');

// plot normally
plot();
// re-plot on resize
// without this the plot stays at the same sime when the window is resized
// There is no need to recalculate the width as it is obtained from the
// container element, which should escale on a responsive fashion
window.addEventListener('tResize', plot);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":1,"./modules/array_unique":3,"./modules/throttle":4,"jquery.flot.orderBars":2}]},{},[5]);

//# sourceMappingURL=pipe_basins.js.map
