@extends('layouts.master')

@section('title', 'Control de Arenas - Cuencas')

@section('content')

<p>Seleccione un campo:</p>
<ol>
    @foreach ($campos as $campo)
    <li><a href="/arenas/cuencas/campo/{{ $campo->id }}">
        {{ $campo->name }}
    </a></li>
    @endforeach
</ol>

@endsection