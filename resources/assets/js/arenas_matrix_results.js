import './app.js'

import $ from 'jquery'

// Plot options
// This is passed to flot jQuery plugin
const plot_options = {
    xaxis: {
        // Log scale on x axis
        transform: v => (v > 0) ? Math.log10(v) : 0,
        ticks: axis => {
            const res = []
            for (let i = 0; i < axis.max; i += 100)
                if (i <= 500)
                    res.push(i)
                else if (i % 200 === 0)
                    res.push(i)

            return res
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
        },
    },
    colors: ['blue', 'gray', 'gray', 'gray', 'gray', 'gray']
}

// Module global, jQuery DOM element where the plot is going to be drawn
let $plot = null

// Called when the module loads (see end of file)
function init() {
    cacheDom()
    getData()
        .then(renderPlot, handleError)
}

function cacheDom() {
    $plot = $('.plot')
}

// Initiates a JSON request to the server in order to get the plot data
function getData() {
    const id = $plot.data('sampleGroupId')
    return $.getJSON(`/api/arenas/get_matrix_plot/${id}`)
}

// Renders the plot on the screen using flot jQuery plugin.
// data is the JSON response (already parsed)
function renderPlot(data) {
    const min = Math.min(data.points[0].grain_size, data.x10)
    const x10_line = makeLines(data.x10, 10, min)
    const x60_line = makeLines(data.x60, 60, min)
    const x90_line = makeLines(data.x90, 90, min)
    const x50_line = makeLines(data.x50, 50, min)
    const x30_line = makeLines(data.x30, 30, min)
    const series = [
        flattenPoints(data.points),
        x10_line,
        x60_line,
        x90_line,
        x50_line,
        x30_line
    ]

    $.plot($plot, series, plot_options)

    setupAxes()
}

// Makes a ┐-shaped pair of lines
function makeLines(x, y, min) {
    return [
        [min, y],
        [x,   y],
        [x,   0]
    ]
}

// Transform [{grain_size: x1, cummulative_rel_freq: y1},...] into [[x1,y1],...]
function flattenPoints(points) {
    const res = []
    for (const point of points)
        res.push([point.grain_size, point.cummulative_rel_freq])

    return res
}

// Setup the plot axes labels after the plot is drawn
// The yaxis label is rotated and centrated vertically
function setupAxes() {
    // yaxis
    const $yaxis = $('<div class=\'axisLabel yaxisLabel\'></div>')
    $yaxis
        .text('Porcentaje Acumulado en Peso (%)')
        .appendTo($plot)

    // Since CSS transforms use the top-left corner of the label as the transform origin,
    // we need to center the y-axis label by shifting it down by half its width.
    // Subtract 20 to factor the chart's bottom margin into the centering.
    $yaxis.css('margin-top', $yaxis.width() / 2 - 20)

    // xaxis
    $('<div class=\'axisLabel xaxisLabel\'></div>')
        .text('Tamaño partícula (Micras)')
        .appendTo($plot)
}

// Called when the JSON request fails
function handleError() {
    // TODO: print error to DOM
    alert('Falló la carga de datos para crear el gráfico')
}

init()
