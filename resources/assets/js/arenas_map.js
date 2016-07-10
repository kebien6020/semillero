const Map = require('./map.js')
      $   = require('jquery');

let markers_data = {
    title_key: 'well.name',
    longitude_key: 'well.longitude',
    latitude_key: 'well.latitude',
    show: [
        {
            display: 'Mecanismo de control de arena: ',
            key: 'mechanism'
        },
        {
            display: 'Fecha de instalación (mes/día/año): ',
            key: 'install_date'
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
    actions: [
        {
            display: 'Información del completamiento del pozo',
            url: model => `/arenas/map/${model.id}`
        },
        {
            display: 'Editar',
            url: model => `/arenas/map/${model.well.id}/edit`
        }
    ],
    color_mode: 'name',
    color_pallete: ['red', 'blue', 'yellow', 'aqua'],
    color_by: {
        key: 'group'
    }
}

function init() {
    getData()
        .then(setupMap, handleAjaxError);
}

function getData() {
    const promise = $.when(
        $.getJSON('/api/arenas/sand_controls'),
        $.getJSON('/api/arenas/sand_control_groups')
    );
    return promise;
}

// ES6 Destructuring arrays.
// Here we are getting the first element of each param
function setupMap([sand_controls], [groups]){
    markers_data.data = sand_controls;
    markers_data.color_by.values = groups;

    Map.load(() => {
        Map.setupMarkers(markers_data);
    });
}

function handleAjaxError(){
    alert('Error cargando los datos del mapa desde el servidor');

}

init();