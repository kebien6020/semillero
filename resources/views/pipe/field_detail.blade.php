@extends ('layouts.container')

@section ('title', "Tuberias - Tendencias - $fieldName")

{{-- Use same plotting script as basin_detail --}}
@section ('script', 'pipe_basin_detail')

{{-- @section ('view-class', 'pipe-field-detail') --}}

@section ('content')

<header>
    <h1>Tendencias en {{ $fieldName }} <small>Tuberías de Corrosión</small></h1>
</header>

<main>
    <p>
        Parrafo explicativo.
    </p>

    <div id="plot-data" style="display: none;">{{ $occurrences->toJson() }}</div>
    {{-- Placeholder for plot --}}
    <p>Gráfico por años</p>
    <div id="year-plot" style="height: 50vh; width: 100%;"></div>
    <p>Gráfico por grado de tubería</p>
    <div id="type-plot" style="height: 50vh; width: 100%;"></div>
    {{-- <div id="legend-container"><div id="plot-legend"></div></div> --}}

    <p>
        Seleccione un pozo para ver mas detalles:
    </p>
    <div class="list-group">
        @foreach ($wells as $well)
            <a href="/tuberias/pozos/{{ $well->id }}">{{ $well->name }}</a>
        @endforeach
    </div>
</main>

@endsection
