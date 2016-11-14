@extends ('layouts.container')

@section ('title', 'Completamientos Múltiples - Matriz de Selección')

@section ('script', 'multiple_matrix')

@section ('content')

<header>
    <h1>Matriz de Selección <small>Completamientos Múltiples</small></h1>
</header>

<main>
    <p>
        La matriz de seleccion de completamiento multiple permite identificar pozos candidatos por medio de una serie de preguntas que se encuentran a continuación y como resultado recomienda un tipo de completamiento.
    </p>
    <br>
    <div id="matrix">Cargando matriz de selección...</div>
</main>

@endsection
