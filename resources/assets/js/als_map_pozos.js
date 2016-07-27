import './app'
import Map from './map'
import $ from 'jquery'

let markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'name',
    color_pallete: ['red', 'blue', 'yellow', 'aqua'],
    color_by: 'als_occurrences.als',
    on_open_marker: setupMarker
}

function setupMarker(infowindow, well) {
    let html = '<div class="als-occurrences">'
    for (let als_occurrence of well.als_occurrences) {
        html += `<hr>
                 
                 <strong>Sistema de levantamiento:</strong>
                 ${als_occurrence.als}<br>

                 <strong>Fecha de instalación:</strong>
                 ${als_occurrence.start_date}<br>

                 <strong>Siglas del evento:</strong>
                 ${als_occurrence.event}<br>`
        if (als_occurrence.reason) {
            html += `<strong>Causa de la intervención:</strong>
                     ${als_occurrence.reason}<br>`
        }
        if (als_occurrence.main_goal) {
            html += `<strong>Objetivo principal:</strong>
                     ${als_occurrence.main_goal}<br>`   
        }
    }
    html += '</div>'

    const prevContent = infowindow.getContent()
    infowindow.setContent(prevContent + html)
}

function init() {
    getData()
        .then(setupMap, handleAjaxError)
}

function getData() {
    return $.getJSON('/api/sla/wells')
}


function setupMap(als_occurrences){
    markers_data.data = als_occurrences

    Map.load(() => {
        Map.setupMarkers(markers_data)
    });
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor')
}

init()