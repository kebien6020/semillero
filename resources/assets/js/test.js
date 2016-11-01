import './app'
import Map from './map'
import $ from 'jquery'

const markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'name',
    color_by: 'name',
    show: [
        {
            display: 'Cuenca: ',
            key: 'basin.name'
        },
        {
            display: 'Longitud: ',
            key: 'longitude'
        },
        {
            display: 'Latitud: ',
            key: 'latitude'
        },
    ],
};

function init() {
    getFields().then(setupMap, () => alert('error 1'))
}

function getFields() {
    return $.getJSON('/test/api/fields')
}

function setupMap(fields) {
    fields.map(field => {
        if (field.latitude == null || field.longitude == null){
            field.latitude = field.wells[0].latitude
            field.longitude = field.wells[0].longitude
        }
        return field
    })

    markers_data.data = fields;

    Map.load(() => {
        Map.setupMarkers(markers_data);
    });
}

init()
