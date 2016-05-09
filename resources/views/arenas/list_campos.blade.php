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
    <a class="fancy-button-small" href="/arenas/table_upload/arenas_campos">
        Añadir datos
    </a>
</div>

@endsection