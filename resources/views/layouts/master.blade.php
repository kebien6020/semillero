@extends('layouts.master_min')

@section('header')

<header>
    <h1 class="title"><a href="/">Semillero de Completamiento</a></h1>
</header>

@endsection

@section('menu')

<div class="sidebar">
    <div class="sidebar-widget">
        <h2>Menu</h2>
        <ul>
            <li><a href="/arenas/map">Mapa control de arenas</a></li>
            <li><a href="/arenas/matrix">Selección control de arenas</a></li>
            <li><a href="/arenas/campos">Matriz control de arenas</a></li>
            <li><a href="/fluidos/map/campos">Fluidos de completamiento</a></li>
            <li><a href="/sla/map">SLA</a></li>
        </ul>
    </div>
</div>

@endsection