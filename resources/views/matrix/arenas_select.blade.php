@extends('layouts.master')

@section('title', 'Control de Arenas')

@section('content')

<p>Seleccionar entre los datos guardados</p>
<ol>
    @foreach ($tablas as $tabla)
    <li><a href="/matrix/arenas/{{ $tabla->id }}">
        {{ $tabla->name }}
    </a></li>
    @endforeach
</ol>
<div class="button-container">
    <div class="fancy-button-small">
        Nuevo
    </div>
</div>
@endsection