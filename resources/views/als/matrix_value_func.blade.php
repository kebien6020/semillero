@extends ('layouts.container')

@section ('title', 'SLA - Criterios')

@section ('content')

<header>
    <h1>Funciones valor</h1>
</header>

@include ('partial.messages')

<main>
    <p>
        Aquí podrá configurar las funciones valor para cada combinación Criterio-Alternativa.
    </p>
    <p>
        Seleccione el criterio de selección para el que desea configurar sus funciones valor:
    </p>
    <div class="list-group">
        @foreach ($criteria as $criterion)
            <a href="/sla/matrix/criteria/{{ $criterion->id }}">{{ $criterion->name }}</a>
        @endforeach
    </div>

    <div class="buttons">
        <a href="/sla/matrix/criteria/new">Agregar criterio</a>
    </div>
</main>

@endsection
