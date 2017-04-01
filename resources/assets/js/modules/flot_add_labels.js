import $ from 'jquery'

export default
function flotAddLabels(plot, {xOffset = 0, yOffset = - 25, fadeIn = false, process} = {}) {
    // Adapted from http://stackoverflow.com/a/2601155
    $.each(plot.getData()[0].data, function(i, point){
        const o = plot.pointOffset({x: point[0], y: point[1]})
        let value = point[1]
        if (process)
            value = process.call(null, value)
        const $label = $('<div class="data-point-label">' + value + '</div>')

        $label.css({
            position: 'absolute',
            left: o.left + xOffset,
            top: o.top + yOffset,
            transform: 'translateX(-50%)',  // Center
        })
        if (fadeIn)
            $label.css({display: 'none'})

        $label.appendTo(plot.getPlaceholder())

        if (fadeIn)
            $label.fadeIn('slow')
    })
}
