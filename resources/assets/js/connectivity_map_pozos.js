import './app'
import Map from './map'
import $ from 'jquery'

let markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'name',
    color_by: {
        key: 'connectivity_occurrences.method',
        values: [
            'ABRASIJET',
            'CASING GUN',
            'EXPANDABLE',
            'HIGH SHOT',
            'PERFORATE',
            'SCALL GUN',
            'SLICK GUN',
            'TBG CONVEY',
            'TCP',
            'TRHUTUBING',
            'WIRELINE',
            'OTHERS',
            'No Reporta'
        ]
    },
    on_open_marker: setupMarker
}

function setupMarker(infowindow, well) {
    let html = `<h2 class="marker-title">${well.name}</h2>
                <div class="connectivity-occurrences">`
    for (let connectivity_occurrence of well.connectivity_occurrences) {
        html += `<hr>
                 
                 <strong>Método de cañoneo:</strong>
                 ${connectivity_occurrence.method}<br>

                 <strong>Fecha de inicio:</strong>
                 ${connectivity_occurrence.start_date}<br>

                 <strong>Fecha de finalización:</strong>
                 ${connectivity_occurrence.end_date}<br>`
    }
    html += '</div>'

    infowindow.setContent(html)
}

function init() {
    getData()
        .then(setupMap, handleAjaxError)
}

function getData() {
    return $.getJSON('/conectividad/api/wells')
}


function setupMap(wells){
    markers_data.data = wells

    Map.load(() => {
        Map.setupMarkers(markers_data)
    });
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor')
}

init()