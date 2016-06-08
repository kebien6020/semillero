@extends('layouts.master_min')

@section('title','Home')

@section('head')
    <link rel="stylesheet" type="text/css" href="/css/home.css">

    {{-- Cool Background --}}
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery-backstretch/2.0.4/jquery.backstretch.min.js"></script>
    <script type="text/javascript">
    $(function(){
        $.backstretch("images/bg.png");
    });
    </script>
    {{-- End Cool Background --}}
@endsection

@section('raw-content')
    
<div class="jumbotron" style="background:rgba(255,255,255,0.3);">
    <div class="container">
        <div class="page-header text-center">
            <h1 class="title">Semillero</h1>
        </div>
        <div class="btn-group btn-group-lg">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                Mecanismos de Control de Arenas
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a href="/arenas/map">Mapa por Pozos</a></li>
                <li><a href="/arenas/matrix">Matriz de Selección</a></li>
                <li><a href="/arenas/campos">Información por Campos</a></li>
            </ul>
        </div>

        <div class="btn-group btn-group-lg">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                Fluidos de Completamiento
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a href="/fluidos/map/pozos">Mapa por Pozos</a></li>
                <li><a href="/fluidos/map/campos">Matriz por Campos</a></li>
            </ul>
        </div>
    </div>
</div>


@endsection