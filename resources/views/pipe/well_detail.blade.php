@extends ('layouts.container')

@section ('title', "Tuberias - Tendencias - {$well->name}")

{{-- Use same plotting script as basin_detail --}}
@section ('script', 'pipe_basin_detail')

{{-- @section ('view-class', 'pipe-field-detail') --}}

@section ('content')
{{-- Helper functions --}}
<?php
$rows = [
    'Nombre Comun del Pozo' => $well->name,
    'Campo' => $well->field->name,
    'Cuenca' => $well->field->basin->name,
    'Longitud' => $well->longitude,
    'Latitud' => $well->latitude,
    'Año' => $well->pipeOccurrence->year,
    'Grado de Tubería' => $well->pipeOccurrence->type,
    'Corrosion' => $well->pipeOccurrence->corrosion,
]
?>

<header>
    <h1>Datos del pozo {{ $well->name }} <small>Tuberías de Corrosión</small></h1>
</header>

<main>
    <p>
        Parrafo explicativo.
    </p>
    <table>
        <tbody>
            @foreach ($rows as $key => $value)
                <tr>
                    <th>{{ $key }}</th>
                    <td>{{ $value }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</main>

@endsection
