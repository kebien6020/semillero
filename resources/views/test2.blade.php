@extends('layouts.master')

@section('script', 'test')

@section('content')

@include('partial.messages')

<div class="map-content">
    <div id="legend"></div>
    <div id="map" class="loading">Cargando...</div>
    <div class="buttons">
        <a href="/sla/table_upload/sla_ocurrencias">
            Importar Datos
        </a>
    </div>
</div>

@endsection