import './app'
import $ from 'jquery'
import throttle from './modules/throttle'
import flotAddLabels from './modules/flot_add_labels'

// Query the DOM elements we are going to need
const $yearPlot = document.getElementById('year-plot')
const $typePlot = document.getElementById('type-plot')
const $plotData = document.getElementById('plot-data')

// Obtain the plot data from the DOM
const serverData = JSON.parse($plotData.innerHTML)

// Returns a function that when called graphs the plot
const makePlotFn = (data, $targetElem) => {
    // Map the data to the format flot requires
    const series = [{
        // Replace xcoord with serial number
        data: data.map((d, i) => [i, d[1]]),
    }]

    // Setup ticks
    const ticks = data.map((d, i) => [i, d[0]])

    // Flot's options object
    const options = {
        series: {
            bars: {show: true}
        },
        bars: {
            align: 'center',
            barWidth: 0.5,
        },
        legend: {
            show: false,
        },
        xaxis: {
            ticks: ticks,
            min: -0.5,
            max: ticks.length - 1 + 0.5,
        }
    }

    // Sum of all ycoords
    const sum = data.map(d => d[1]).reduce((a, b) => a + b)
    // Utility function
    const percentage = frac => (frac * 100).toFixed(1) + '%'
    // Wrap plot action in a function
    const plotFn = () => {
        const plot = $.plot($targetElem, series, options)

        flotAddLabels(plot, {
            yOffset: -15,
            process: value => `${value} (${percentage(value / sum)})`,
        })
    }

    return plotFn
}

// Make the plot functions
const plotYears = makePlotFn(serverData.byYear, $yearPlot)
const plotType = makePlotFn(serverData.byType, $typePlot)

// Use them
plotYears()
plotType()

// Create custom throttled resize event
throttle('resize', 'tResize')

// Re-plot on tResize
window.addEventListener('tResize', plotYears)
window.addEventListener('tResize', plotType)
