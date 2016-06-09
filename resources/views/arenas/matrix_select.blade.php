@extends('layouts.container')

@section('title', 'Control de Arenas')

@section('content')

<div class="page-header">
    <h1>Selección de mecanismos de control de arena con base en un análisis de granulometría</h1>
</div>

<p>A continuación puede seleccionar entre las muestras que han sido ingresadas en el aplicativo: </p>
<div class="list-group">
    @foreach ($tablas as $tabla)
    <a class="list-group-item" href="{{ url('arenas/matrix/' . $tabla->id) }}">
        {{ $tabla->name }}
    </a>
    @endforeach
</div>
<div class="buttons">
    <a href="{{ url('arenas/table_upload/arenas_muestras') }}" class="btn btn-primary">
        Cargar datos
    </a>
</div>
@endsection