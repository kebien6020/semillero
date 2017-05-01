@extends ('layouts.container')

@section ('title', "Tuberias - Tendencias - $basin->name")

@section ('script', 'pipe_basin_detail')

{{-- @section ('view-class', 'pipe-basin-detail') --}}

@section ('content')

<header>
    <h1>Tendencias en {{$basin->name}}</h1>
</header>

<main>
    <div id="plot-data" style="display: none;">{{ $occurrences->toJson() }}</div>

    <p>
        Se muestra la frecuencia de instalación de sartas de producción en la Cuenca {{ $basin->name }} por años.
    </p>
    {{-- Placeholder for plot --}}
    <div id="year-plot" style="height: 50vh; width: 100%;"></div>

    <p>
        Se muestra la frecuencia de instalación de sartas de producción en la Cuenca {{ $basin->name }} por grado de acero.
    </p>
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
