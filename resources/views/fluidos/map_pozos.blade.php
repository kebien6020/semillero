@extends('layouts.master')

@section('title', 'Mapa Fluidos Pozos')

@section('content')

@include('partial.messages')

<div class="map-content">

    <div id="legend"></div>
    <div id="map" class="loading"></div>
    <div class="buttons">
        <a href="/fluidos/table_upload/fluidos_pozos">
            Importar Datos
        </a>
        <!-- TODO: Implement
        <a href="#">
            Añadir pozo
        </a>
        -->
    </div>
    
</div>


@endsection

@section('script', 'fluidos_map_pozos')
