@extends('layouts.master')

@section('title', 'Mapa Fluidos Campos')

@section('view-class', 'fluidos-map-campos')

@section('content')

@include('partial.messages')

<div class="map-content">

    <div id="map" class="loading"></div>
    <div class="buttons">
        <a href="/fluidos/table_upload/fluidos_rangos">
            Importar Datos
        </a>
    </div>

    <div id="fullscreen-overlay">
        <div id="white-overlay">
            <h1 id="overlay-title"></h1>
            <div class="horizontal-container">
                <div class="left-container">
                    <h4>Distribución de fluidos</h4>
                    <div id="left-plot"></div>
                </div>
                <div class="right-container">
                    <h4>Distribución de densidades</h4>
                    <div id="right-plot"></div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('script', 'fluidos_map_campos')