@extends('layouts.master')

@section('title', 'Control de Arenas')

@section('content')

<p>Seleccionar entre los datos guardados</p>
<ol>
    @foreach ($tablas as $tabla)
    <li><a href="/arenas/matrix/{{ $tabla->id }}">
        {{ $tabla->name }}
    </a></li>
    @endforeach
</ol>
<div class="button-container">
    <a href="/arenas/table_upload/arenas_muestras" class="fancy-button-small">
        Cargar datos
    </a>
</div>
@endsection