@extends('layouts.master')

@section('title', 'Mapa Fluidos Pozos')

@section('content')

@include('partial.messages')

<div class="map-content">

    <div id="legend"></div>
    <div id="map"></div>
    <div class="buttons">
        <a href="{{ url('fluidos/table_upload/fluidos_pozos') }}" class="btn btn-primary">
            Importar Datos
        </a>
        <!-- TODO: Implement
        <a href="#" class="btn btn-primary">
            Añadir pozo
        </a>
        -->
    </div>
    
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
        key: 'fluid.color',
        values: JSON.parse('{!! $fluids !!}')
    },
    base_url: '{{ url('/') }}',
    data: JSON.parse('{!! $occurrences !!}')
}

Map.load(function(google, map) {
    Map.setupMarkers(markers_data);
});
</script>

@endsection
