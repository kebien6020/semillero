<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Testing</title>
    <link href="{{ url('css/app.css') }}" rel="stylesheet" type="text/css">
    <link href="{{ url('css/map.css') }}" rel="stylesheet" type="text/css">
</head>
<body>
    <div id="map"></div>
    <div id="legend"></div>

    <script src="/js/map.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
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
                return '{{ url('arenas/map') }}/' + model.id;
            }
        },
        {
            display: 'Editar',
            url: function(model){
                return '{{ url('arenas/map') }}/' + model.well.id + '/edit';
            }
        }
    ],
    color_mode: 'name',
    color_pallete: ['red', 'blue', 'yellow', 'aqua'],
    color_by: {
        key: 'group',
        values: JSON.parse('{!! \App\SandControl::all()->pluck('group')->unique()->values()->toJson() !!}')
    },
    base_url: '{{ url('/') }}',
    data: JSON.parse('{!! \App\SandControl::with('well.field.basin')->get()->toJson() !!}')
}

Map.load(function(google, map) {
    Map.setupMarkers(markers_data);
});
    </script>
    <script src="/js/app.js" type="text/javascript" charset="utf-8"></script>
</body>
</html>