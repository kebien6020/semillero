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
    <a href="/">MGCP</a>
  </header>

  {{-- Start collapsed (on mobile) --}}
  <div class="navigation-collapse collapse">
    <ul>
      <li class="dropdown">
        <a href="#"
           data-toggle="dropdown"
           role="button"
           aria-expanded="false">
           Proyectos<span class="caret"></span>
        </a>
        <ul>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Control de Arena
            </a>

            <ul role="menu">
              @include('partial.arenas_links')
            </ul>
          </li>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Fluidos de Completamiento
            </a>

            <ul role="menu">
              @include('partial.fluidos_links')
            </ul>
          </li>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Sistemas de Levantamiento Artificial
            </a>

            <ul role="menu">
              @include('partial.sla_links')
            </ul>
          </li>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Conectividad
            </a>

            <ul role="menu">
              @include('partial.conectividad_links')
            </ul>
          </li>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Completamientos Múltiples
            </a>

            <ul role="menu">
              @include('partial.multiples_links')
            </ul>
          </li>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Metalurgia de Tubería
            </a>

            <ul role="menu">
              @include('partial.pipe_links')
            </ul>
          </li>
          <li class="dropdown">
            <a href="#"
               data-toggle="dropdown"
               role="button"
               aria-expanded="false">
               Nuevas Tecnologías: Métodos de Conectividad
            </a>

            <ul role="menu">
              @include('partial.nt_perforate')
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="right">
      <li class="dropdown">
        <a href="#"
           data-toggle="dropdown"
           role="button"
           aria-expanded="false">
           {{ auth()->user()? auth()->user()->name : 'Invitado' }}<span class="caret"></a>
        <ul role="menu">
          @include('partial.account_links')
        </ul>
      </li>
    </ul>
  </div>
</nav>

@endsection
