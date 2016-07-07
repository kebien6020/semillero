@extends('layouts.master_min')

@section('title','Página de Inicio')

@section('content')
    
<div id="home">
    <div class="white-section">
        <div class="page-header text-center">
            <h1 class="title">Módulo Integral de Completamiento de Pozos</h1>
        </div>
        <div class="btn-group btn-group-lg">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                Aplicativo de selección de Mecanismos de Control de Arena
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a href="{{ url('arenas/map') }}">Mapa de la instalación de mecanismos de control de arena</a></li>
                <li><a href="{{ url('arenas/campos') }}">Matriz de selección preliminar de mecanismos de control de arena en los campos operados por Ecopetrol S.A.</a></li>
                <li><a href="{{ url('arenas/matrix') }}">Herramienta de selección de mecanismos de control de arena a partir de datos granulométricos</a></li>
            </ul>
        </div>

        <div class="btn-group btn-group-lg">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                Fluidos de Completamiento
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a href="{{ url('fluidos/map/pozos') }}">Mapa por Pozos</a></li>
                <li><a href="{{ url('fluidos/map/campos') }}">Matriz por Campos</a></li>
            </ul>
        </div>
    </div>
</div>


@endsection

@section('script', 'home')