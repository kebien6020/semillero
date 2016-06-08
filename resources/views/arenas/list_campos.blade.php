@extends('layouts.container')

@section('title', 'Control de Arenas por Campos')

@section('content')

<div class="page-header">
    <h1>Información por Campos <small>Mecanismos de Control de Arenas</small></h1>
</div>

<p>Seleccione un campo:</p>
<ol class="list-group">
    @foreach ($basins as $basin)
    <li class="list-group-item">
        {{ $basin->name }}
        <div class="list-group">
            @foreach ($basin->fields->sortBy('name')->values() as $field)
                <a class="list-group-item" href="/arenas/campos/{{ $field->id }}">{{ $field->name }}</a>
            @endforeach
        </div>
    </li>
    @endforeach
</ol>

<div class="buttons">
    <a href="/arenas/table_upload/arenas_campos" class="btn btn-primary">
        Cargar datos
    </a>
</div>

@endsection