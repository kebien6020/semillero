@extends('layouts.master_min')

@section('navbar')

<nav id="navbar">
  <header>
    <button type="button" data-toggle="collapse" data-target=".navigation-collapse">
      {{-- Three bars making ☰ icon --}}
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    <a href="/">MICP</a>
  </header>

  {{-- Start collapsed (on mobile) --}}
  <div class="navigation-collapse collapse">
    <ul>
      <li class="dropdown">
        <a href="#"
           data-toggle="dropdown"
           role="button"
           aria-expanded="false">
           Aplicativo de selección de Mecanismos de Control de Arena<span class="caret"></span>
        </a>
        
        <ul role="menu">
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
      </li>
      <li class="dropdown">
        <a href="#"
           data-toggle="dropdown"
           role="button"
           aria-expanded="false">
           Fluidos de Completamiento<span class="caret"></span>
        </a>
        
        <ul role="menu">
          <li><a href="/fluidos/map/pozos">Mapa por Pozos</a></li>
          <li><a href="/fluidos/map/campos">Mapa por Campos</a></li>
        </ul>
      </li>
    </ul>
    <!-- TODO: About...
    <ul class="nav navbar-nav navbar-right">
      <li><a href="#">Acerca de...</a></li>
    </ul>
    -->
  </div>
</nav>

@endsection