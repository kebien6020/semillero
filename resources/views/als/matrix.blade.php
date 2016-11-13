@extends ('layouts.container')

@section ('title', 'SLA - Matriz')

@section ('script', 'als_matrix')

@section ('content')

<header>
    <h1>Matriz de Seleccion <small>Sistemas de levantamiento artificial</small></h1>
</header>

@include ('partial.messages')

<main>
    <p>
        La matriz de seleccion preliminar de sistemas de levantamiento artificial permite realizar la selección de un sistema de levantamiento artificial a partir de datos suminisitrados.
    </p>
    <div id="matrix-data" style="display: none;">
        {
            "criteria": {{ $criteria->toJson() }},
            "alternatives": {{ $alternatives->toJson() }}
        }
    </div>
    <div id="matrix"></div>
    <div class="buttons">
        <a href="/sla/matrix/config">Configurar matriz</a>
    </div>
</main>

@endsection
