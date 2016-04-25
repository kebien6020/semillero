@extends('layouts.master')

@section('title', 'Control de Arenas por Campos')

@section('content')

<p>Seleccione un campo:</p>
<ol>
    @foreach ($cuencas as $cuenca)
    <li>
        {{ $cuenca->name }}
        <ol>
            @foreach ($cuenca->campos as $campo)
            <li>
                <a href="/arenas/campos/{{ $campo->id }}">{{ $campo->name }}</a>
            </li>
            @endforeach
        </ol>
    </li>
    @endforeach
</ol>

<div class="button-container">
    <a class="fancy-button-small" href="/arenas/campos_add_data">
        Añadir datos
    </a>
</div>

@endsection