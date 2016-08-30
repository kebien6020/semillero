@extends('layouts.master')

@section('title', 'Completamientos Múltiples - Mapa Pozos')

@section('script', 'multiple_map_pozos')

@section('content')

@include('partial.messages')

<div class="map-content">
    <div id="legend"></div>
    <div id="map" class="loading">Cargando...</div>
    <div class="buttons">
        <a href="/multiples/table_upload/multiples_ocurrencias">
            Importar Datos
        </a>
    </div>
</div>

@endsection