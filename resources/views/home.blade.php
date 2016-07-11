@extends('layouts.master_min')

@section('title','Página de Inicio')

@section('view-class', 'home')

@section('content')

<div class="white-section">
    <header class="title">
        <h1 class="responsive-title">Módulo Integral de Completamiento de Pozos</h1>
    </header>
    <div class="button-group-container">
        <div>
            <button type="button" data-toggle="dropdown">
                Aplicativo de selección de Mecanismos de Control de Arena
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                <li>
                    <a href="/arenas/map">Mapa de la instalación de mecanismos de control de arena</a>
                </li>
                <li>
                    <a href="/arenas/campos">Matriz de selección preliminar de mecanismos de control de arena en los campos operados por Ecopetrol S.A.</a>
                </li>
                <li>
                    <a href="/arenas/matrix">Herramienta de selección de mecanismos de control de arena a partir de datos granulométricos</a>
                </li>
            </ul>
        </div>

        <div>
            <button type="button" data-toggle="dropdown">
                Fluidos de Completamiento
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                <li><a href="/fluidos/map/pozos">Mapa por Pozos</a></li>
                <li><a href="/fluidos/map/campos">Matriz por Campos</a></li>
            </ul>
        </div>
    </div>
</div>


@endsection

@section('script', 'home')