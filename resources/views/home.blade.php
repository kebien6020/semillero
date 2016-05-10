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

@section('content')

    <h1 class="title">Semillero de Completamiento</h1>
    <div class="button-container">
        <a href="/arenas/map" class="fancy-button">Mapa de Mecanismos de Control de Arenas</a>
        <a href="/arenas/matrix" class="fancy-button">Selección de un Mecanismo de Control de Arenas</a>
        <a href="/arenas/campos" class="fancy-button">Matriz general de Mecanismos de Control de Arenas</a>
        <a href="/fluidos/map/pozos" class="fancy-button">Mapa de Fluidos de Completamiento por Campo</a>
        <a href="/fluidos/map/campos" class="fancy-button">Mapa de Fluidos de Completamiento por Pozos</a>
    </div>


@endsection