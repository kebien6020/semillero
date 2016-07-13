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
            <h1 id="overlay-title">Campo: <span id="field-name"></span></h1>
            <div class="horizontal-container">
                <div class="left-container">
                    <h4>Distribución de fluidos</h4>
                    <div id="left-plot"></div>
                </div>
                <div class="right-container">
                    <h4>Distribución de densidades para el fluido: <span id="fluid-name"></span></h4>
                    <div id="right-plot"></div>
                    <p>Densidad minima: <span id="min-dens"></span></p>
                    <p>Densidad máxima: <span id="max-dens"></span></p>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('script', 'fluidos_map_campos')