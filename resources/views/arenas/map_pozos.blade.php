@extends('layouts.master')

@section('title', 'Mapa de control de arena')

@section('content')

@include('partial.messages')

<div class="map-content">

    <div id="legend"></div>
    <div id="map" class="loading">Cargando...</div>
    <div class="buttons">
        <a href="/arenas/table_upload/arenas_pozos">
            Importar Datos
        </a>
        <!-- TODO: Implement
        <a href="#">
            Añadir pozo
        </a>-->
    </div>
</div>

@endsection

@section('script', 'arenas_map')
