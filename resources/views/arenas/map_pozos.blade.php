@extends('layouts.master')

@section('title', 'Mapa de control de arena')

@section('head')

    <link href="{{ url('css/map.css') }}" rel="stylesheet" type="text/css">

@endsection

@section('content')

    @if (session()->has('success'))
        <div class="alert alert-success">{!! session('success') !!}</div>
    @endif

    <div id="legend"></div>
    <div id="map"></div>
    <div class="buttons">
        <a href="{{ url('arenas/table_upload/arenas_pozos') }}" class="btn btn-primary">
            Importar Datos
        </a>
        <!-- TODO: Implement
        <a href="#" class="btn btn-primary">
            Añadir pozo
        </a>-->
    </div>

@endsection

@section('script', 'map')

@section('custom-script')
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
        values: JSON.parse('{!! $groups !!}')
    },
    base_url: '{{ url('/') }}',
    data: JSON.parse('{!! $sandControls !!}')
}

Map.load(function() {
    Map.setupMarkers(markers_data);
});
</script>
@endsection

