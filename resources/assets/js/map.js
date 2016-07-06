let gapi       = require('google-maps'),
    $          = require('jquery'),
    arr_unique = require('./modules/array_unique.js');
                 require('./app.js');

gapi.KEY = 'AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8';

let map = null;

// These propierties can be overriden by the caller before calling load
exports.CONTAINER_SELECTOR = '#map';
exports.LEGEND_SELECTOR = '#legend'

exports.load = function(fn){

    gapi.load(function(google){
        let options = {
            center: {lng:-73, lat:4},
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.HYBRID,
        };
        let $container = $(exports.CONTAINER_SELECTOR)[0];

        map = new google.maps.Map($container, options);
        
        if (fn)
            fn(google, map);
    });

};

let info_windows = [];
let default_color_pallete = [
    'red',
    'aqua',
    'blue',
    'brown',
    'green',
    'orange',
    'pink',
    'purple',
    'yellow',
    'gray',
    'black'
];

exports.setupMarkers = function(data) {
    let longitude_key = data.longitude_key || 'longitude';
    let latitude_key = data.latitude_key || 'latitude';
    let base_url = data.base_url || '';
    let color_mode = data.color_mode || 'name';
    let color_key = null;
    let color_pallete = default_color_pallete;
    let color_values = null;
    let color_table = {};
    let callback = data.on_open_marker || function(){};


    if (color_mode !== 'name' && color_mode !== 'color') {
        color_mode = 'none';
    }

    if (color_mode !== 'none') {
        if (color_mode === 'name' && data.color_pallete)
            color_pallete = arr_unique(
                data.color_pallete.concat(default_color_pallete));
        if (typeof data.color_by === 'object'){
            color_key = data.color_by.key;
            color_values = data.color_by.values;
        } else if (typeof data.color_by === 'string') {
            color_key = data.color_by;
            color_values = arr_unique(data.data.map(function(model){
                return modelGet(model, color_key);
            }));
        } else {
            throw 'Must specify valid color_by';
        }

        if (color_mode === 'name') {
            for (let i = 0; i < color_values.length; ++i) {
                let color_value = color_values[i];
                if (i-1 > color_pallete.length) {
                    color_table[color_value] = 'gray';
                    continue;
                }
                color_table[color_value] = color_pallete[i];
            }
        } else {
            for (let color_value of color_values) {
                color_table[color_value.name] = color_value.color;
            }
        }

        setupLegend(color_table, color_mode, base_url);
    }

    for (let model of data.data) {
        let content = '';
        if (data.title_key)
            content += showTitle(model, data.title_key);
        if (data.show)
            content += showFields(model, data.show);
        if (data.actions)
            content += showActions(model, data.actions);
        let info_window = new google.maps.InfoWindow({content});
        info_windows.push(info_window);
        
        let color = '';
        if (color_mode !== 'none')
            color = modelGet(model, color_key);
        if (color_mode === 'name')
            color = color_table[color];
        else if (color_mode === 'none')
            color = 'red';
        let color_url = getColorUrl(color, color_mode, base_url);

        let marker_options = {
            position: {
                lng: Number(modelGet(model, longitude_key)),
                lat: Number(modelGet(model, latitude_key))
            },
            map: map,
            icon: color_url,
        };

        let marker = new google.maps.Marker(marker_options);

        marker.addListener('click', markerListener(info_window, marker, callback, model));

    }
}

function setupLegend(color_table, mode, base_url) {
    let $legend = $(exports.LEGEND_SELECTOR);
    for (let key in color_table) {
        let value = color_table[key];
        let url = getColorUrl(value, mode, base_url);
        $legend.append('<p><img width="11" height="20" src="'
            + url + '">' + key + '</p>');
    }
}

function showTitle(model, title) {
    return '<h2 class="marker-title">' + modelGet(model, title) + '</h2>';
}

function showFields(model, fields) {
    let res = '';
    for (let field of fields) {
        if (field.nullable && !modelGet(model, field.key)) continue;
        res += '<div class="marker-field"><span class="marker-field-name">';
        res += field.display;
        res += '</span><span class="marker-field-value">';
        res += modelGet(model, field.key);
        res += '</span></div>';
    }
    return res;
}

function showActions(model, actions) {
    let res = '<div class="marker-actions">';
    let links = [];
    for (let action of actions) {
        let link = '<a href="';
        if (typeof action.url === 'function')
            link += action.url(model);
        else
            link += action.url;
        link += '">';
        link += action.display;
        link += '</a>';
        links.push(link);
    }
    res += links.join(' | ');
    res += '</div>';
    return res;
}

function modelGet(model, key) {
    let res = model;
    for (let subkey of key.split('.'))
        res = res[subkey];

    if (res === undefined)
        throw 'key: ' + key + ' not found in model ' + JSON.stringify(model, null, 2);

    return res;
}

function getColorUrl(color, mode, base_url) {
    if (mode === 'name') {
        return base_url + '/images/spotlight-poi-' + color + '.png';
    } else if (mode === 'color') {
        // Expand from shorthand
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        color = color.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        if (color.length == 7)
            color = color.slice(1);
        // Pin image from google itself
        return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + color;
    }
}

function markerListener(infoWindow, marker, callback, model){
    return function(){
        for (var info of info_windows){
            info.close();
        }
        infoWindow.open(map, marker);
        callback(infoWindow, model);
    }
}

// Global export
window.Map = module.exports;
