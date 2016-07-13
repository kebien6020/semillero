import './app.js';
import Map from './map.js';
import $ from 'jquery';

const plot_options = {
    series: {
        pie: {
            show: true,
            radius: 1,
            label: {
                radius: 3/4,
                show: true,
                background: {
                    opacity: 0.5,
                    color: "#000"
                },
                formatter: labelFormatter,
            },
        }
    },
    legend: {show: false},
    grid: {
        hoverable: true,
        clickable: true,
    }
};

function labelFormatter(label, series) {
    const val = series.data[0][1];
    const pct = Math.round(series.percent);
    return `
    <div class="plot-label">
        <label>${label}</label>
        <div>${val} (${pct}%)</div>
    </div>`;
}

const markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'none',
    on_open_marker: setupMarker
};

// Global DOM Elements
let $overlay,
    $leftPlot,
    $rightPlot,
    $fieldName,
    $fluidName;

function init() {
    cacheDOM();
    bindHandlers();
    getMapData()
        .then(setupMap, handleMapError);
}

function cacheDOM() {
    $overlay = $('#fullscreen-overlay');
    $leftPlot = $overlay.find('#left-plot');
    $rightPlot = $overlay.find('#right-plot');
    $fieldName = $overlay.find('#field-name');
    $fluidName = $overlay.find('#fluid-name');
}

function bindHandlers() {
    $overlay.click(fadeOverlay);
}

function fadeOverlay(event) {
    if (this === event.target){
        $(this).fadeOut();
        $leftPlot.unbind('plotclick');
    }
}

function getMapData() {
    return $.getJSON('/api/fluidos/fields');
}

function setupMap(fields) {
    markers_data.data = fields;

    Map.load(() => {
        Map.setupMarkers(markers_data);
    });
}

function handleMapError() {
    alert('Error cargando los datos del mapa desde el servidor');
}

// Note: setupMarker and setupMarkers *are* different.
// See markers_data.on_open_marker
function setupMarker(infoWindow, field) {
    // Infowindow
    const plotId = 'plot_' + field.id;
    if ($('#' + plotId).length > 0) return;

    const plotHtml = `
        <div style="width:250px; height:250px;" id="${plotId}">
        </div>`;

    let content = infoWindow.getContent();
    content += plotHtml;
    infoWindow.setContent(content);

    const dist = field.distribution;
    let data = [];
    for (const fluid of dist){
        data.push({
            label: fluid.name,
            data: fluid.occurrences,
            color: fluid.color,
            fluid_id: fluid.id
        });
    }
    const $plot = $('#' + plotId);
    $.plot($plot, data, plot_options);

    // Listen to plotclick
    $plot.bind('plotclick', (event, pos, obj) => {
        markerPlotClick(event, obj, field.id, data);
    });
}

function markerPlotClick(event, obj, field_id, data) {
    const fluid_id = obj.series.fluid_id;
    // Reset fluid and field names in the dom before fadeIn
    $fieldName.html('');
    $fluidName.html('');
    // Overlay
    $overlay.fadeIn();

    // Left plot contents
    $.plot($leftPlot, data, plot_options);

    // Right plot contents
    setupRightPlot(field_id, fluid_id);

    // Listen to plotclick
    $leftPlot.bind('plotclick', (event, pos, obj) => {
        leftPlotClick(event, obj, field_id);
    });
}

function leftPlotClick(event, obj, field_id) {
    const fluid_id = obj.series.fluid_id;
    setupRightPlot(field_id, fluid_id);
}

function setupRightPlot(field_id, fluid_id) {
    $rightPlot.empty();
    getRightPlot(field_id, fluid_id)
        .then(renderRightPlot, handlePlotError);
}

function getRightPlot(field_id, fluid_id) {
    return $.getJSON(`/api/fluidos/density_dist/${field_id}/${fluid_id}`);
}

function renderRightPlot(data) {
    if (data.ranges.length < 1){
        $rightPlot.html('<p class="error">No hay informacion</p>');
    } else {
        let plot_data = [];
        for (const range of data.ranges) {
            let {min, max} = range.range;
            plot_data.push({
                label: `${min} PPG - ${max} PPG`,
                data: range.occurrences
            });
        }
        $.plot($rightPlot, plot_data, plot_options);
    }
    $fieldName.html(data.field_name);
    $fluidName.html(data.fluid_name);

}

function handlePlotError() {
    $rightPlot.html('<p class="error">Error comunicandose al servidor</p>');
}

init();
