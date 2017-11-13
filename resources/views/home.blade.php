@extends('layouts.master_min')

@section('title','Página de Inicio')

@section('view-class', 'home')

@section('content')

<div class="white-section">
    <header class="title">
        <h1 class="responsive-title">Manual General de Completamiento de Pozos</h1>
    </header>
    <div class="button-group-container">
        <div>
            <button type="button" data-toggle="dropdown">
                Aplicativo de selección de Mecanismos de Control de Arena
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.arenas_links')
            </ul>
        </div>

        <div>
            <button type="button" data-toggle="dropdown">
                Fluidos de Completamiento
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.fluidos_links')
            </ul>
        </div>
        <div>
            <button type="button" data-toggle="dropdown">
                Sistemas de Levantamiento Artificial
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.sla_links')
            </ul>
        </div>
        <div>
            <button type="button" data-toggle="dropdown">
                Conectividad
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.conectividad_links')
            </ul>
        </div>
        <div>
            <button type="button" data-toggle="dropdown">
                Completamientos Múltiples
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.multiples_links')
            </ul>
        </div>
        <div>
            <button type="button" data-toggle="dropdown">
                Metalurgia de Tuberia de Producción
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.pipe_links')
            </ul>
        </div>
        <div>
            <button type="button" data-toggle="dropdown">
                Nuevas Tecnologías: Métodos de Cañoneo
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu collapse">
                @include('partial.nt_perforate')
            </ul>
        </div>
        <div>
            <a href="/dashboard">
                Administrar Información
            </a>
        </div>
    </div>
</div>


@endsection

@section('script', 'home')

@section('head')
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-backstretch/2.0.4/jquery.backstretch.min.js"></script>
@endsection
