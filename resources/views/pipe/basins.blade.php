@extends ('layouts.container')

@section ('title', 'Tuberias - Matriz de Tendencias')

@section ('script', 'pipe_basins')

@section ('view-class', 'pipe-basins')

@section ('content')

<header>
    <h1>No es una Matriz de Tendencias ♥ <small>Tuberías de Corrosión</small></h1>
</header>

<main>
    <p>
        Parrafo explicativo.
    </p>

    <div id="plot-data" style="display: none;">{{ $occurrences->toJson() }}</div>
    {{-- Placeholder for multi-bar plot --}}
    <div id="plot"></div>
    <div id="legend-container"><div id="plot-legend"></div></div>

    <p>
        Seleccione una cuenca para ver mas detalles:
    </p>
    <div class="list-group">
        @foreach ($basins as $basin)
            <a href="/tuberias/cuencas/{{ $basin->id }}">{{ $basin->name }}</a>
        @endforeach
    </div>
</main>

@endsection
