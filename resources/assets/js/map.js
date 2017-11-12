require('./app.js')

let gapi       = require('google-maps'),
    $          = require('jquery'),
    arr_unique = require('./modules/array_unique.js')

gapi.KEY = 'AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8'

let map = null

// These propierties can be overriden by the caller before calling load
exports.CONTAINER_SELECTOR = '#map'
exports.LEGEND_SELECTOR = '#legend'

// Fix for weird gmaps problem
exports.prototype = exports.prototype || Object

exports.load = function(fn){

    gapi.load(function(google){
        const options = {
            center: {lng:-73, lat:4},
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.HYBRID,
        }
        const $container = $(exports.CONTAINER_SELECTOR)
        $container.empty()

        map = new google.maps.Map($container[0], options)

        if (fn)
            fn(google, map)
        $container.removeClass('loading')
    })

}

const info_windows = []
const default_color_pallete = [
    'red',
    'aqua',
    'blue',
    'brown',
    'green',
    'orange',
    'pink',
    'purple',
    'yellow',
    'black',
    'dark-green',
    'dark-blue',
    'dark-purple',
    'gray',
]

exports.setupMarkers = function(data) {
    const longitude_key = data.longitude_key || 'longitude'
    const latitude_key = data.latitude_key || 'latitude'
    const base_url = data.base_url || ''
    let color_mode = data.color_mode || 'name'
    let color_key = null
    let color_pallete = default_color_pallete
    let color_values = null
    const color_table = {}
    const callback = data.on_open_marker || function(){}


    if (color_mode !== 'name' && color_mode !== 'color')
        color_mode = 'none'


    if (color_mode !== 'none') {
        if (color_mode === 'name' && data.color_pallete)
            color_pallete = arr_unique(
                data.color_pallete.concat(default_color_pallete))
        if (typeof data.color_by === 'object'){
            color_key = data.color_by.key
            color_values = data.color_by.values
        } else if (typeof data.color_by === 'string') {
            color_key = data.color_by
            color_values = arr_unique(data.data.map(function(model){
                return modelGet(model, color_key)
            }))
        } else {
            throw 'Must specify valid color_by'
        }

        if (color_mode === 'name')
            for (let i = 0; i < color_values.length; ++i) {
                const color_value = color_values[i]
                if (i+1 > color_pallete.length) {
                    color_table[color_value] = 'gray'
                    continue
                }
                color_table[color_value] = color_pallete[i]
            }
        else
            for (const color_value of color_values)
                color_table[color_value.name] = color_value.color



        setupLegend(color_table, color_mode, base_url)
    }

    for (const model of data.data) {
        let content = ''
        if (data.title_key)
            content += showTitle(model, data.title_key)
        if (data.show)
            content += showFields(model, data.show)
        if (data.actions)
            content += showActions(model, data.actions)
        const info_window = new google.maps.InfoWindow({content})
        info_windows.push(info_window)

        let color = ''
        if (color_mode !== 'none')
            color = modelGet(model, color_key)
        if (color_mode === 'name')
            color = color_table[color]
        else if (color_mode === 'none')
            color = 'red'
        const color_url = getColorUrl(color, color_mode, base_url)

        const marker_options = {
            position: {
                lng: Number(modelGet(model, longitude_key)),
                lat: Number(modelGet(model, latitude_key))
            },
            map: map,
            icon: color_url,
        }

        const marker = new google.maps.Marker(marker_options)

        marker.addListener('click', markerListener(info_window, marker, callback, model))

    }
}

function setupLegend(color_table, mode, base_url) {
    const $legend = $(exports.LEGEND_SELECTOR)
    for (const key in color_table) {
        const value = color_table[key]
        const url = getColorUrl(value, mode, base_url)
        $legend.append('<p><img width="11" height="20" src="'
            + url + '">' + key + '</p>')
    }
}

function showTitle(model, title) {
    return '<h2 class="marker-title">' + modelGet(model, title) + '</h2>'
}

function showFields(model, fields) {
    let res = ''
    for (const field of fields) {
        if (field.nullable && !modelGet(model, field.key)) continue
        res += '<div class="marker-field"><span class="marker-field-name">'
        res += field.display
        res += '</span><span class="marker-field-value">'
        res += modelGet(model, field.key)
        res += '</span></div>'
    }
    return res
}

function showActions(model, actions) {
    let res = '<div class="marker-actions">'
    const links = []
    for (const action of actions) {
        let link = '<a href="'
        if (typeof action.url === 'function')
            link += action.url(model)
        else
            link += action.url
        link += '">'
        link += action.display
        link += '</a>'
        links.push(link)
    }
    res += links.join(' | ')
    res += '</div>'
    return res
}

function modelGet(model, key) {
    let res = model
    for (const subkey of key.split('.')) {
        if (res === undefined)
            throw 'key: ' + key + ' not found in model ' + JSON.stringify(model, null, 2)
        res = res[subkey]
        if (Array.isArray(res))
            res = res[res.length - 1]
    }



    return res
}

function getColorUrl(color, mode, base_url) {
    if (mode === 'name') {
        return base_url + '/images/spotlight-poi-' + color + '.png'
    } else if (mode === 'color') {
        // Expand from shorthand
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
        color = color.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b
        })
        if (color.length == 7)
            color = color.slice(1)
        // Pin image from google itself
        return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + color
    }
}

function markerListener(infoWindow, marker, callback, model){
    return function(){
        for (const info of info_windows)
            info.close()

        infoWindow.open(map, marker)
        callback(infoWindow, model)
    }
}

// Global export
window.Map = module.exports
