import './app'
import Map from './map'
import $ from 'jquery'

const markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'name',
    // color_pallete: ['red', 'blue', 'yellow', 'aqua'],
    color_by: 'pipe_occurrence.type',
    // },
    show: [
        {
            display: 'Grado de la tubería: ',
            key: 'pipe_occurrence.type'
        },
        {
            display: 'Año de instalación: ',
            key: 'pipe_occurrence.year',
            nullable: true
        },
        {
            display: 'Corrosión: ',
            key: 'pipe_occurrence.corrosion',
            nullable: true
        },
        {
            display: 'Campo: ',
            key: 'field.name'
        },
    ],
}

function init() {
    getData()
        .then(setupMap, handleAjaxError)
}

function getData() {
    return $.getJSON('/tuberias/api/pozos')
}


function setupMap(occurrences){
    markers_data.data = occurrences

    Map.load(() => {
        Map.setupMarkers(markers_data)
    })
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor')
}

init()
