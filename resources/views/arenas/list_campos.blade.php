@extends('layouts.master')

@section('title', 'Control de Arenas por Campos')

@section('content')

<p>Seleccione un campo:</p>
<ol>
    @foreach ($basins as $basin)
    <li>
        {{ $basin->name }}
        <ol>
            @foreach ($basin->fields->sortBy('name')->values() as $field)
            <li>
                <a href="/arenas/campos/{{ $field->id }}">{{ $field->name }}</a>
            </li>
            @endforeach
        </ol>
    </li>
    @endforeach
</ol>

<div class="button-container">
    <a href="/arenas/table_upload/arenas_campos" class="fancy-button-small">
        Cargar datos
    </a>
</div>

@endsection