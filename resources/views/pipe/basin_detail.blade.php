@extends ('layouts.container')

@section ('title', "Tuberias - Tendencias - $basinName")

@section ('script', 'pipe_basin_detail')

{{-- @section ('view-class', 'pipe-basin-detail') --}}

@section ('content')

<header>
    <h1>Tendencias en {{$basinName}} <small>Tuberías de Corrosión</small></h1>
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
        Seleccione un campo para ver mas detalles:
    </p>
    <div class="list-group">
        @foreach ($fields as $field)
            <a href="/tuberias/campos/{{ $field->id }}">{{ $field->name }}</a>
        @endforeach
    </div>
</main>

@endsection
