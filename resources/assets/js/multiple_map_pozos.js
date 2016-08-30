import './app'
import Map from './map'
import $ from 'jquery'

let markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'color',
    color_by: {
        key: 'multiple_occurrences.completion.color',
    },
    on_open_marker: setupMarker
}

function setupMarker(infowindow, well) {
    let html = `<h2 class="marker-title">${well.name}</h2>
                <div class="multiple-occurrences">`
    for (let multiple_occurrence of well.multiple_occurrences) {
        html += `<hr>
                 
                <strong>Sistema de levantamiento:</strong>
                ${multiple_occurrence.completion.name}<br>

                <strong>Fecha de instalación:</strong>
                ${multiple_occurrence.start_date}<br>

                <strong>Siglas del evento:</strong>
                ${multiple_occurrence.event}<br>

                <strong>Causa de la intervención:</strong>
                ${multiple_occurrence.reason}<br>

                <strong>Tipo de Pozo:</strong>
                ${multiple_occurrence.type}<br>`
    }
    html += '</div>'

    infowindow.setContent(html)
}

function init() {
    getData()
        .then(setupMap, handleAjaxError)
}

function getData() {
    const promise = $.when(
        $.getJSON('/multiples/api/wells'),
        $.getJSON('/multiples/api/completions')
    )
    return promise
}


function setupMap([wells], [completions]){
    markers_data.data = wells
    markers_data.color_by.values = completions;

    Map.load(() => {
        Map.setupMarkers(markers_data)
    });
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor')
}

init()