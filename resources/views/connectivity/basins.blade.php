@extends ('layouts.container')

@section ('content')

<header>
    <h1>Matriz de Tendencias <small>Conectividad</small></h1>
</header>

<main>
    <p>
        Aquí puede obtener la matriz de tendencia de conectividad que proporciona la frecuencia de los métodos que se utilizan en cada campo y el método de cañoneo por pozo durante el periodo 2005-2015.
    </p>
    <p>
        Seleccione una cuenca:
    </p>
    <div class="list-group">
        @foreach ($basins as $basin)
            <a href="/conectividad/basins/{{ $basin->id }}">{{ $basin->name }}</a>
        @endforeach
    </div>
</main>

@endsection
