(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(root, factory) {

	if (root === null) {
		throw new Error('Google-maps package can be used only in browser');
	}

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.GoogleMapsLoader = factory();
	}

})(typeof window !== 'undefined' ? window : null, function() {


	'use strict';


	var googleVersion = '3.18';

	var script = null;

	var google = null;

	var loading = false;

	var callbacks = [];

	var onLoadEvents = [];

	var originalCreateLoaderMethod = null;


	var GoogleMapsLoader = {};


	GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

	GoogleMapsLoader.KEY = null;

	GoogleMapsLoader.LIBRARIES = [];

	GoogleMapsLoader.CLIENT = null;

	GoogleMapsLoader.CHANNEL = null;

	GoogleMapsLoader.LANGUAGE = null;

	GoogleMapsLoader.REGION = null;

	GoogleMapsLoader.VERSION = googleVersion;

	GoogleMapsLoader.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';


	GoogleMapsLoader._googleMockApiObject = {};


	GoogleMapsLoader.load = function(fn) {
		if (google === null) {
			if (loading === true) {
				if (fn) {
					callbacks.push(fn);
				}
			} else {
				loading = true;

				window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function() {
					ready(fn);
				};

				GoogleMapsLoader.createLoader();
			}
		} else if (fn) {
			fn(google);
		}
	};


	GoogleMapsLoader.createLoader = function() {
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = GoogleMapsLoader.createUrl();

		document.body.appendChild(script);
	};


	GoogleMapsLoader.isLoaded = function() {
		return google !== null;
	};


	GoogleMapsLoader.createUrl = function() {
		var url = GoogleMapsLoader.URL;

		url += '?callback=' + GoogleMapsLoader.WINDOW_CALLBACK_NAME;

		if (GoogleMapsLoader.KEY) {
			url += '&key=' + GoogleMapsLoader.KEY;
		}

		if (GoogleMapsLoader.LIBRARIES.length > 0) {
			url += '&libraries=' + GoogleMapsLoader.LIBRARIES.join(',');
		}

		if (GoogleMapsLoader.CLIENT) {
			url += '&client=' + GoogleMapsLoader.CLIENT + '&v=' + GoogleMapsLoader.VERSION;
		}

		if (GoogleMapsLoader.CHANNEL) {
			url += '&channel=' + GoogleMapsLoader.CHANNEL;
		}

		if (GoogleMapsLoader.LANGUAGE) {
			url += '&language=' + GoogleMapsLoader.LANGUAGE;
		}

		if (GoogleMapsLoader.REGION) {
			url += '&region=' + GoogleMapsLoader.REGION;
		}

		return url;
	};


	GoogleMapsLoader.release = function(fn) {
		var release = function() {
			GoogleMapsLoader.KEY = null;
			GoogleMapsLoader.LIBRARIES = [];
			GoogleMapsLoader.CLIENT = null;
			GoogleMapsLoader.CHANNEL = null;
			GoogleMapsLoader.LANGUAGE = null;
			GoogleMapsLoader.REGION = null;
			GoogleMapsLoader.VERSION = googleVersion;

			google = null;
			loading = false;
			callbacks = [];
			onLoadEvents = [];

			if (typeof window.google !== 'undefined') {
				delete window.google;
			}

			if (typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
				delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
			}

			if (originalCreateLoaderMethod !== null) {
				GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
				originalCreateLoaderMethod = null;
			}

			if (script !== null) {
				script.parentElement.removeChild(script);
				script = null;
			}

			if (fn) {
				fn();
			}
		};

		if (loading) {
			GoogleMapsLoader.load(function() {
				release();
			});
		} else {
			release();
		}
	};


	GoogleMapsLoader.onLoad = function(fn) {
		onLoadEvents.push(fn);
	};


	GoogleMapsLoader.makeMock = function() {
		originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

		GoogleMapsLoader.createLoader = function() {
			window.google = GoogleMapsLoader._googleMockApiObject;
			window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
		};
	};


	var ready = function(fn) {
		var i;

		loading = false;

		if (google === null) {
			google = window.google;
		}

		for (i = 0; i < onLoadEvents.length; i++) {
			onLoadEvents[i](google);
		}

		if (fn) {
			fn(google);
		}

		for (i = 0; i < callbacks.length; i++) {
			callbacks[i](google);
		}

		callbacks = [];
	};


	return GoogleMapsLoader;

});

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

$('.success-panel, .error-panel').addClass('alert fade in');
$().alert();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

require('./app.js');

var _map = require('./map.js');

var _map2 = _interopRequireDefault(_map);

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var markers_data = {
    title_key: 'well.name',
    longitude_key: 'well.longitude',
    latitude_key: 'well.latitude',
    show: [{
        display: 'Mecanismo de control de arena: ',
        key: 'mechanism'
    }, {
        display: 'Fecha de instalación (mes/día/año): ',
        key: 'install_date'
    }, {
        display: 'Campo: ',
        key: 'well.field.name'
    }, {
        display: 'Siglas del evento: ',
        key: 'event',
        nullable: true
    }],
    actions: [{
        display: 'Información del completamiento del pozo',
        url: function url(model) {
            return '/arenas/map/' + model.id;
        }
    }, {
        display: 'Editar',
        url: function url(model) {
            return '/arenas/map/' + model.well.id + '/edit';
        }
    }],
    color_mode: 'name',
    color_pallete: ['red', 'blue', 'yellow', 'aqua'],
    color_by: {
        key: 'group'
    }
};

function init() {
    getData().then(setupMap, handleAjaxError);
}

function getData() {
    var promise = _jquery2.default.when(_jquery2.default.getJSON('/api/arenas/sand_controls'), _jquery2.default.getJSON('/api/arenas/sand_control_groups'));
    return promise;
}

// ES6 Destructuring arrays.
// Here we are getting the first element of each param
function setupMap(_ref, _ref2) {
    var _ref4 = _slicedToArray(_ref, 1),
        sand_controls = _ref4[0];

    var _ref3 = _slicedToArray(_ref2, 1),
        groups = _ref3[0];

    markers_data.data = sand_controls;
    markers_data.color_by.values = groups;

    _map2.default.load(function () {
        _map2.default.setupMarkers(markers_data);
    });
}

function handleAjaxError() {
    alert('Error cargando los datos del mapa desde el servidor');
}

init();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app.js":2,"./map.js":4}],4:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('./app.js');

var gapi = require('google-maps'),
    $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
    arr_unique = require('./modules/array_unique.js');

gapi.KEY = 'AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8';

var map = null;

// These propierties can be overriden by the caller before calling load
exports.CONTAINER_SELECTOR = '#map';
exports.LEGEND_SELECTOR = '#legend';

// Fix for weird gmaps problem
exports.prototype = exports.prototype || Object;

exports.load = function (fn) {

    gapi.load(function (google) {
        var options = {
            center: { lng: -73, lat: 4 },
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var $container = $(exports.CONTAINER_SELECTOR);
        $container.empty();

        map = new google.maps.Map($container[0], options);

        if (fn) fn(google, map);
        $container.removeClass('loading');
    });
};

var info_windows = [];
var default_color_pallete = ['red', 'aqua', 'blue', 'brown', 'green', 'orange', 'pink', 'purple', 'yellow', 'black', 'dark-green', 'dark-blue', 'dark-purple', 'gray'];

exports.setupMarkers = function (data) {
    var longitude_key = data.longitude_key || 'longitude';
    var latitude_key = data.latitude_key || 'latitude';
    var base_url = data.base_url || '';
    var color_mode = data.color_mode || 'name';
    var color_key = null;
    var color_pallete = default_color_pallete;
    var color_values = null;
    var color_table = {};
    var callback = data.on_open_marker || function () {};

    if (color_mode !== 'name' && color_mode !== 'color') color_mode = 'none';

    if (color_mode !== 'none') {
        if (color_mode === 'name' && data.color_pallete) color_pallete = arr_unique(data.color_pallete.concat(default_color_pallete));
        if (_typeof(data.color_by) === 'object') {
            color_key = data.color_by.key;
            color_values = data.color_by.values;
        } else if (typeof data.color_by === 'string') {
            color_key = data.color_by;
            color_values = arr_unique(data.data.map(function (model) {
                return modelGet(model, color_key);
            }));
        } else {
            throw 'Must specify valid color_by';
        }

        if (color_mode === 'name') for (var i = 0; i < color_values.length; ++i) {
            var color_value = color_values[i];
            if (i + 1 > color_pallete.length) {
                color_table[color_value] = 'gray';
                continue;
            }
            color_table[color_value] = color_pallete[i];
        } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = color_values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _color_value = _step.value;

                    color_table[_color_value.name] = _color_value.color;
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
        }setupLegend(color_table, color_mode, base_url);
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = data.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var model = _step2.value;

            var content = '';
            if (data.title_key) content += showTitle(model, data.title_key);
            if (data.show) content += showFields(model, data.show);
            if (data.actions) content += showActions(model, data.actions);
            var info_window = new google.maps.InfoWindow({ content: content });
            info_windows.push(info_window);

            var color = '';
            if (color_mode !== 'none') color = modelGet(model, color_key);
            if (color_mode === 'name') color = color_table[color];else if (color_mode === 'none') color = 'red';
            var color_url = getColorUrl(color, color_mode, base_url);

            var marker_options = {
                position: {
                    lng: Number(modelGet(model, longitude_key)),
                    lat: Number(modelGet(model, latitude_key))
                },
                map: map,
                icon: color_url
            };

            var marker = new google.maps.Marker(marker_options);

            marker.addListener('click', markerListener(info_window, marker, callback, model));
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
};

function setupLegend(color_table, mode, base_url) {
    var $legend = $(exports.LEGEND_SELECTOR);
    for (var key in color_table) {
        var value = color_table[key];
        var url = getColorUrl(value, mode, base_url);
        $legend.append('<p><img width="11" height="20" src="' + url + '">' + key + '</p>');
    }
}

function showTitle(model, title) {
    return '<h2 class="marker-title">' + modelGet(model, title) + '</h2>';
}

function showFields(model, fields) {
    var res = '';
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var field = _step3.value;

            if (field.nullable && !modelGet(model, field.key)) continue;
            res += '<div class="marker-field"><span class="marker-field-name">';
            res += field.display;
            res += '</span><span class="marker-field-value">';
            res += modelGet(model, field.key);
            res += '</span></div>';
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return res;
}

function showActions(model, actions) {
    var res = '<div class="marker-actions">';
    var links = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = actions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var action = _step4.value;

            var link = '<a href="';
            if (typeof action.url === 'function') link += action.url(model);else link += action.url;
            link += '">';
            link += action.display;
            link += '</a>';
            links.push(link);
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    res += links.join(' | ');
    res += '</div>';
    return res;
}

function modelGet(model, key) {
    var res = model;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = key.split('.')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var subkey = _step5.value;

            if (res === undefined) throw 'key: ' + key + ' not found in model ' + JSON.stringify(model, null, 2);
            res = res[subkey];
            if (Array.isArray(res)) res = res[res.length - 1];
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    return res;
}

function getColorUrl(color, mode, base_url) {
    if (mode === 'name') {
        return base_url + '/images/spotlight-poi-' + color + '.png';
    } else if (mode === 'color') {
        // Expand from shorthand
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        color = color.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        if (color.length == 7) color = color.slice(1);
        // Pin image from google itself
        return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + color;
    }
}

function markerListener(infoWindow, marker, callback, model) {
    return function () {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = info_windows[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var info = _step6.value;

                info.close();
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        infoWindow.open(map, marker);
        callback(infoWindow, model);
    };
}

// Global export
window.Map = module.exports;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app.js":2,"./modules/array_unique.js":5,"google-maps":1}],5:[function(require,module,exports){
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

},{}]},{},[3]);

//# sourceMappingURL=arenas_map.js.map
