import './app.js';
import Map from './map.js';
import $ from 'jquery';

let markers_data = {
    title_key: 'well.name',
    longitude_key: 'well.longitude',
    latitude_key: 'well.latitude',
    show: [
        {
            display: 'Fluido de completamiento: ',
            key: 'fluid.name'
        },
        {
            display: 'Densidad del fluido: ',
            key: 'density',
            nullable: true
        },
        {
            display: 'Campo: ',
            key: 'well.field.name'
        },
        {
            display: 'Siglas del evento: ',
            key: 'event',
            nullable: true
        }
    ],
    color_mode: 'color',
    color_by: {
        key: 'fluid.color'
    }
}

function init() {
    getData()
        .then(setupMap, handleAjaxError);
}

function getData() {
    const promise = $.when(
        $.getJSON('/api/fluidos/fluid_occurrences'),
        $.getJSON('/api/fluidos/fluids')
    );
    return promise;
}

// ES6 Destructuring arrays.
// Here we are getting the first element of each param
function setupMap([fluid_occurrences], [fluids]){
    markers_data.data = fluid_occurrences;
    markers_data.color_by.values = fluids;

    Map.load(() => {
        Map.setupMarkers(markers_data);
    });
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor');

}

init();