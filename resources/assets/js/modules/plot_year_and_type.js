/**
 * Plot year and type on #year-plot, #type-plot
 * using data from #plot-data in the form of
 * {
 *    byYear: [year data],
 *    byType: [type data],
 *    basin: [basin name]
 * }
 */
 import $ from 'jquery'
 import throttle from './throttle'
 import flotAddLabels from './flot_add_labels'

 // Returns a function that when called graphs the plot
 const makePlotFn = (data, $targetElem, color) => {
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

     // Setup graph color if provided
     if (color)
         options.colors = [color]

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

 export default function plotYearAndType(colorLookup = {}) {

     // Query the DOM elements we are going to need
     const $yearPlot = document.getElementById('year-plot')
     const $typePlot = document.getElementById('type-plot')
     const $plotData = document.getElementById('plot-data')

     // Obtain the plot data from the DOM
     const serverData = JSON.parse($plotData.innerHTML)

     // Lookup the color to use from the basin name
     //
     // If the color is not found it will be simply undefined
     // and makePlotFn will simply ignore it for being a falsy
     // value and use default flot coloring
     const color = colorLookup[serverData.basin]

     // Make the plot functions
     const plotYears = makePlotFn(serverData.byYear, $yearPlot, color)
     const plotType = makePlotFn(serverData.byType, $typePlot, color)

     // Use them
     plotYears()
     plotType()

     // Create custom throttled resize event
     throttle('resize', 'tResize')

     // Re-plot on tResize
     window.addEventListener('tResize', plotYears)
     window.addEventListener('tResize', plotType)

 }
