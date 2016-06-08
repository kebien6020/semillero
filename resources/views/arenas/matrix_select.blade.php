@extends('layouts.container')

@section('title', 'Control de Arenas')

@section('content')

<div class="page-header">
    <h1>Matriz de Seleccion <small>Mecanismos de Control de Arena</small></h1>
</div>

<p>Seleccionar entre los datos guardados</p>
<div class="list-group">
    @foreach ($tablas as $tabla)
    <a class="list-group-item" href="/arenas/matrix/{{ $tabla->id }}">
        {{ $tabla->name }}
    </a>
    @endforeach
</div>
<div class="buttons">
    <a href="/arenas/table_upload/arenas_muestras" class="btn btn-primary">
        Cargar datos
    </a>
</div>
@endsection