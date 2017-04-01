import './app'
import $ from 'jquery'
import throttle from './modules/throttle'
import flotAddLabels from './modules/flot_add_labels'

// Query the DOM elements we are going to need
const $plot = document.getElementById('plot')
const $plotData = document.getElementById('plot-data')

// Obtain the plot data from the DOM
const data = JSON.parse($plotData.innerHTML)

// Map the data to the format flot requires
const series = [{
    data: data.map(d => [d.year, d.occurrences]),
    label: 'something'
}]
// Utility functions for finding min and max
const min = arr => Math.min.apply(null, arr)
const max = arr => Math.max.apply(null, arr)

const years = data.map(d => d.year)
const minyear = min(years)
const maxyear = max(years)

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
        min: minyear - 1,
        max: maxyear + 1,
        ticks: years,
        tickFormatter: num => String(num)
    }
}

// Wrap plot action in a function
const plot = () => {
    const sum = data.map(d => d.occurrences).reduce((a, b) => a + b)
    const percentage = frac => (frac * 100).toFixed(1) + '%'

    const plot = $.plot($plot, series, options)
    flotAddLabels(plot, {
        yOffset: -10,
        process: value => `${value} (${percentage(value / sum)})`,
    })
}

// Make the plot
plot()

// Create custom throttled resize event
throttle('resize', 'tResize')

// Re-plot on tResize
window.addEventListener('tResize', plot)
