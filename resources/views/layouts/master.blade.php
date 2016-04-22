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
            <li><a href="/map/arenas">Mapa control de arenas</a></li>
            <li><a href="/matrix/arenas">Selección control de arenas</a></li>
            <li><a href="/map/fluidos">Fluidos de completamiento</a></li>
            <li><a href="/map/sla">SLA</a></li>
        </ul>
    </div>
</div>

@endsection