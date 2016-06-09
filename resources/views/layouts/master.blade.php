@extends('layouts.master_min')

@section('navbar')

<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigation-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="{{ url('/') }}">Semillero</a>
        </div>

        <div class="collapse navbar-collapse" id="navigation-collapse">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Mecanismos de Control de Arenas<span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="{{ url('arenas/map') }}">Mapa por Pozos</a></li>
                <li><a href="{{ url('arenas/matrix') }}">Matriz de Selección</a></li>
                <li><a href="{{ url('arenas/campos') }}">Información por Campos</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Fluidos de Completamiento<span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="{{ url('fluidos/map/pozos') }}">Mapa por Pozos</a></li>
                <li><a href="{{ url('fluidos/map/campos') }}">Mapa por Campos</a></li>
              </ul>
            </li>
          </ul>
          <!-- TODO: About...
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Acerca de...</a></li>
          </ul>
          -->
        </div>
    </div>
</nav>

@endsection

@section('raw-content')

@yield('content')

@endsection