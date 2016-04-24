@extends('layouts.master')

@section('title', 'Control de Arenas - Cuencas')

@section('content')

<p>Seleccione una cuenca:</p>
<ol>
    @foreach ($cuencas as $cuenca)
    <li><a href="/arenas/cuencas/{{ $cuenca->id }}">
        {{ $cuenca->name }}
    </a></li>
    @endforeach
</ol>

@endsection