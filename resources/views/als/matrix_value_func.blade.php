@extends ('layouts.container')

@section ('content')

<header>
    <h1>Funciones valor</h1>
</header>

@include ('partial.messages')

<main>
    <p>
        Aquí podrá configurar las funciones valor para cada combinación Parametro-Alternativa.
    </p>
    <p>
        Seleccione el parametro que desea configurar:
    </p>
    <div class="list-group">
        @foreach ($params as $param)
            <a href="/sla/matrix/params/{{ $param->id }}">{{ $param->name }}</a>
        @endforeach
    </div>

    <div class="buttons">
        <a href="/sla/matrix/params/new">Agregar parametro</a>
    </div>
</main>

@endsection
