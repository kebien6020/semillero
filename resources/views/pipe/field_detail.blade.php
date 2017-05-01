@extends ('layouts.container')

@section ('title', "Tuberias - Tendencias - $field->name")

@section ('script', 'pipe_field_detail')

{{-- @section ('view-class', 'pipe-field-detail') --}}

@section ('content')

<header>
    <h1>Tendencias en {{ $field->name }}</h1>
</header>

<main>
    <table>
        <tbody>
            <tr>
                <th>Nombre del Campo</th>
                <td>{{$field->name}}</td>
            </tr>
            <tr>
                <th>Vicepresidencia</th>
                <td>{{$field->vicepresidency}}</td>
            </tr>
            <tr>
                <th>No. Pozos del Campo</th>
                <td>{{$wells->count()}}</td>
            </tr>
        </tbody>
    </table>
    <div id="plot-data" style="display: none;">{{ $occurrences->toJson() }}</div>

    <br>
    <p>
        Se muestra la frecuencia de instalación de sartas de producción en el Campo {{ $field->name }} por años.
    </p>
    {{-- Placeholder for plot --}}
    <div id="year-plot" style="height: 50vh; width: 100%;"></div>

    <p>
        Se muestra la frecuencia de instalación de sartas de producción en el Campo {{ $field->name }} por grado de acero.
    </p>
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
