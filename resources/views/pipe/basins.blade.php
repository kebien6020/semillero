@extends ('layouts.container')

@section ('title', 'Tuberias - Tabla Breviario')

@section ('script', 'pipe_basins')

@section ('view-class', 'pipe-basins')

@section ('content')

<header>
    <h1>Tabla Breviario</h1>
</header>

<main>
    <p>
        Aquí puede obtener la tabla breviario de metalurgia de tubería de producción que proporciona la frecuencia de instalación de los grados de acero que se utilizan en cada campo y pozo, también la frecuencia de instalación por año en la campaña del 2005 al 2015. Adicionalmente provee información sobre reportes realizados de corrosión presentada entre el 2009 y el 2015 de los pozos mencionados anteriormente.
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
