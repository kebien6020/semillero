@extends ('layouts.container')

@section ('content')

<header>
    <h1>Configuración de la Matriz</h1>
</header>

@include ('partial.messages')

<main>
    <p>Aquí podrá configurar los valores bajo los que opera la matriz de selección preliminar de sistemas de levantamiento artificial.</p>

    <div class="list-group">
        <a href="/sla/matrix/value_func">Configurar funciones valor</a>
        <a href="/sla/matrix/weights">Configurar pesos</a>
    </div>
</main>

@endsection
