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
          @include('partial.arenas_links')
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
          @include('partial.fluidos_links')
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