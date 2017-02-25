@extends('layouts.master')

@section('title', 'Tuberías de Corrosión - Mapa')

@section('script', 'pipe_map')

@section('content')

@include('partial.messages')

<div class="map-content">
    <div id="legend"></div>
    <div id="map" class="loading">Cargando...</div>
    <div class="buttons">
        <a href="/tuberias/table_upload/tuberias_ocurrencias">
            Importar Datos
        </a>
    </div>
</div>

@endsection
