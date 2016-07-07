let Map = require('./map.js')
    $   = require('jquery');

var markers_data = {
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
            url: function(model){
                return '/arenas/map/' + model.id;
            }
        },
        {
            display: 'Editar',
            url: function(model){
                return '/arenas/map/' + model.well.id + '/edit';
            }
        }
    ],
    color_mode: 'name',
    color_pallete: ['red', 'blue', 'yellow', 'aqua'],
    color_by: {
        key: 'group'
    }
}

function init() {
    getData(setupMap);
}

function getData(callback) {
    $.when(
        $.getJSON('/api/arenas/sand_controls'),
        $.getJSON('/api/arenas/sand_control_groups')
    ).done((response1, response2)=>{
        if (response1 === undefined || response2 === undefined){
            fail();
            return;
        }
        // response (1 and 2) have the form [ data, statusText, jqXHR ]
        let sand_controls = response1[0],
            groups = response2[0];

        callback(sand_controls, groups);
     })
     .fail(fail);

    function fail(){
        // TODO: Output error to screen
        alert('Error cargando los datos del mapa desde el servidor');
    }
}

function setupMap(sand_controls, groups){
    markers_data.data = sand_controls;
    markers_data.color_by.values = groups;

    console.log(markers_data);

    Map.load(function(google, map) {
        Map.setupMarkers(markers_data);
    });
}

init();