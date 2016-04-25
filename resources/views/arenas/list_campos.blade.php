@extends('layouts.master')

@section('title', 'Control de Arenas - Cuencas')

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

@endsection