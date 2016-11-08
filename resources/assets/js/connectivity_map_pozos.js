import './app'
import Map from './map'
import $ from 'jquery'

const markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'color',
    color_by: {
        key: 'connectivity_occurrences.connectivity_method.color',
    },
    on_open_marker: setupMarker
}

function setupMarker(infowindow, well) {
    let html = `<h2 class="marker-title">${well.name}</h2>
                <div class="connectivity-occurrences">`
    for (const connectivity_occurrence of well.connectivity_occurrences)
        html += `<hr>

                 <strong>Método de cañoneo:</strong>
                 ${connectivity_occurrence.connectivity_method.name}<br>

                 <strong>Fecha de inicio:</strong>
                 ${connectivity_occurrence.start_date}<br>

                 <strong>Fecha de finalización:</strong>
                 ${connectivity_occurrence.end_date}<br>`

    html += '</div>'

    infowindow.setContent(html)
}

function init() {
    getData()
        .then(setupMap, handleAjaxError)
}

function getData() {
    return $.when(
        $.getJSON('/conectividad/api/wells'),
        $.getJSON('/conectividad/api/methods')
    )
}


function setupMap([wells], [methods]){
    markers_data.data = wells
    markers_data.color_by.values = methods

    Map.load(() => {
        Map.setupMarkers(markers_data)
    })
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor')
}

init()
