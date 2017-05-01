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
    <h1>Datos del pozo {{ $well->name }}</h1>
</header>

<main>
    <p>
        En la tabla se muestran las especificaciones en cuanto a ubicación y caracterización del pozo. También se muestra si hubo o no un reporte por corrosión en la campaña 2009 a 2015.
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
