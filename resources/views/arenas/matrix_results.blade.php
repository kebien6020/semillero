@extends('layouts.container')

@section('title', 'Selección de Control de Arena')

@section('content')
<?php

$calculated = [
    [
        'display' => 'Tamaño Grano Promedio [Micras]',
        'name' => 'average',
        'decimals' => 2
    ],
    [
        'display' => 'Tipo Grano de la Arena',
        'name' => 'grain_type'
    ],
    [
        'display' => 'Percentil D90 (X10)',
        'name' => 'x10',
        'decimals' => 2
    ],
    [
        'display' => 'Percentil D70 (X30)',
        'name' => 'x30',
        'decimals' => 2
    ],
    [
        'display' => 'Percentil D50 (X50)',
        'name' => 'x50',
        'decimals' => 2
    ],
    [
        'display' => 'Percentil D40 (X60)',
        'name' => 'x60',
        'decimals' => 2
    ],
    [
        'display' => 'Percentil D10 (X90)',
        'name' => 'x90',
        'decimals' => 2
    ],
    [
        'display' => 'Coeficiente de uniformidad (U)',
        'name' => 'u',
        'decimals' => 3
    ],
    [
        'display' => 'Uniformidad Arena',
        'name' => 'u_txt'
    ]
];

?>

<header>
    <h1>Selección y Configuración de Mecanismos de Control de Arena</h1>
    <h3>{{ $table_name }}</h3>
    <h2><small>Análisis granulométrico</small></h2>
</header>

@include('partial.messages')

{{-- Entered data --}}
<table class="table-hover">
    <thead>
        <tr>
            <th colspan="2">
                Datos granulométricos de la muestra de interés
            </th>
        <tr>
            <th>Tamaño de grano [Micras]</th>
            <th>Peso de muestra [gr]</th>
        </tr>
    </thead>
    <tbody>
        @foreach($samples as $sample)
            <tr data-sample-id="{{ $sample->id }}" >
                <td>{{ $sample->grain_size }}</td>
                <td>{{ $sample->frequency }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- Plot --}}
<h2 class="table-header">Curva de distribución granulométrica de la muestra de interés</h2>
<div class="plot" data-sample-group-id="{{ $sampleGroupId }}">{{-- Placeholder for the plot --}}</div>

{{-- Results --}}
<table class="table-hover">
    {{-- Calculated values --}}
    <thead>
        <tr><th colspan="2">Variables granulométricas calculadas para la selección y diseño de mecanismos de control de arena</th></tr>
    </thead>
    <tbody>
        {{ render_rows($calculated, $results) }}

    {{-- Suggested mechanisms --}}
        <tr>
            <th colspan="2">
                Mecanismos de control de arena sugeridos
            </th>
        </tr>
        @foreach ($results->suggested as $i => $recommendation)
            <tr>
                <td>
                  @if ($recommendation['is_new']) Nueva Tecnología
                  @else Tecnología Convencional
                  @endif
                  de Control de Arena Recomendada {{ $i + 1 }}</td>
                <td>{{ $recommendation['name'] }}</td>
            </tr>
        @endforeach
        @if (count($results->suggested) > 0)
          @if ($results->uses_gravel)
            <tr>
                <td>Tamaño de grava sugerido con base en el criterio de Saucier (in)</td>
                <td>{{ round($results->average_gravel_size, 3) }}</td>
            </tr>
            <tr>
                <td>Tamaño de grava US. Mesh</td>
                <td>{{ $results->us_gravel_mesh }}</td>
            </tr>
          @endif
        @else
          <tr>
            <td colspan="2">No se recomienda control de arena tipo mecánico</td>
          </tr>
        @endif
    </tbody>
</table>
@if (count($results->suggested) > 0)
<table id="config_mec">
    <thead>
        <tr>
            <th colspan="3">Recomendaciones para la configuración/diseño del mecanismo de control de arena</th>
        </tr>
        <tr>
            <th>Modelo (Postulado)</th>
            <th colspan="2">Rango Tamaño Ranura [in]</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($results->config as $config)
            <tr>
                <td>{{ $config->name }}</td>
                <td>{{ round($config->min, 3) }}</td>
                <td>{{ round($config->max, 3) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

@endsection

@section('script', 'arenas_matrix_results')
