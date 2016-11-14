@extends('layouts.container')

@section ('title', 'SLA - Alternativas')

@section('content')

<header>
    <h1>Configurar Alternativas</h1>
</header>

<main>
    <p>
        Aquí se pordrán configurar las alternativas de selección (sistemas de levantamiento artificial).
    </p>
    <div class="list-group">
        @foreach ($alternatives as $alternative)
            <a href="/sla/matrix/alternatives/{{ $alternative->id }}">{{ $alternative->name }}</a>
        @endforeach
    </div>
    <div class="buttons">
        <a href="/sla/matrix/alternatives/new">Agregar alternativa</a>
    </div>
</main>

@endsection
