@extends('layouts.master')

@section('title', 'Conectividad - Mapa pozos')

@section('script', 'connectivity_map_pozos')

@section('content')

@include('partial.messages')

<div class="map-content">
    <div id="legend"></div>
    <div id="map" class="loading">Cargando...</div>
    <div class="buttons">
        <a href="/conectividad/table_upload/conectividad_ocurrencias">
            Importar Datos
        </a>
    </div>
</div>

@endsection