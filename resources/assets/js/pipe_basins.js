import './app'
import $ from 'jquery'
import 'jquery.flot.orderBars' // Allows for multi-series bar graph
import throttle from './modules/throttle'
import arrayUnique from './modules/array_unique'

// Query the DOM elements we are going to need
const $plot = document.getElementById('plot')
const $legendContainer = document.getElementById('plot-legend')
const $plotData = document.getElementById('plot-data')

// Obtain the plot data from the DOM
const data = JSON.parse($plotData.innerHTML)

// Map the data to the format flot requires
const series = data.map(d => ({
    bars: {order: true},  // Enable the orderBars plugin
    label: d.basin,
    data: d.occurrences,
}))

// Utility functions for finding min and max
const flatMap = (arr, fn) => Array.prototype.concat.apply([], arr.map(fn))
const min = arr => Math.min.apply(null, arr)
const max = arr => Math.max.apply(null, arr)

// Concat all datapoints together and then map to the x coordinate
const years = flatMap(data, d => d.occurrences).map(point => point[0])

const minyear = min(years)
const maxyear = max(years)

// Flot's options object
const options = {
    series: {
        bars: {show: true}
    },
    bars: {
        // 0.3 is the space between bars from different datapoints
        barWidth: (1 - 0.3) / series.length,
    },
    legend: {
        // Horizontal legend
        noColumns: 0,
        container: $legendContainer,
    },
    xaxis: {
        min: minyear - 1,
        max: maxyear + 1,
        ticks: arrayUnique(years),
    }
}

// Wrap plot action in a function
const plot = () => {
    $.plot($plot, series, options)
}

// Create custom throttled resize event
throttle('resize', 'tResize')

// plot normally
plot()
// re-plot on resize
// without this the plot stays at the same sime when the window is resized
// There is no need to recalculate the width as it is obtained from the
// container element, which should escale on a responsive fashion
window.addEventListener('tResize', plot)
