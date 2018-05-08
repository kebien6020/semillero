@extends('layouts.container')

@section('title', 'Control de Arenas - Cuencas')

@section('content')

<?php

$elems = [
    [
        'display' => 'Profundidad Promedio del Intervalo de Interes [ft]',
        'name' => 'interval_avg_len'
    ],
    [
        'display' => 'Coeficiente de uniformidad (U)',
        'name' => 'uniformity'
    ],
    [
        'display' => 'Tamaño de Grano Promedio [Micras]',
        'name' => 'avg_grain_size'
    ],
    [
        'display' => 'Rango Tamaño de Grano [Micras]',
        'name' => 'grain_size_range'
    ],
    [
        'display' => 'Tipo de Arena',
        'name' => 'type'
    ],
    [
        'display' => 'Característica de la arena',
        'name' => 'uniformity_txt'
    ]
];

$installed = [
    [
        'display' => 'Mecanismo Usado',
        'name' => 'installed_mechanism'
    ],
    [
        'display' => 'Ancho de la ranura (in)',
        'name' => 'installed_groove_size'
    ],
    [
        'display' => 'Tamaño de grano promedio de grava (in)',
        'name' => 'installed_grain_size'
    ],
    [
        'display' => 'Tamaño Grava US. Mesh',
        'name' => 'installed_us_mesh'
    ]
];

$recommended = [
    [
        'display' => 'Mecanismo Recomendado',
        'name' => 'recommended_mechanism'
    ],
    [
        'display' => 'Tamaño Grava US. Mesh',
        'name' => 'recommended_us_mesh'
    ],
];

$field = ufirst($summary->field->name);

?>

<header>
    <h1>Mecanismo de Control de Arena Sugerido <small>Campo {{ $field }}</small></h1>
</header>

@include('partial.messages')

<table class="table-hover">
    <thead>
        <tr>
            <th colspan="2">Características granulométricas de la arena productora en el Campo {{ $field }}</th>
        </tr>
    </thead>
    <tbody>
        {{-- General content --}}

        {{ render_rows($elems, $summary) }}

        {{-- Installed --}}
        <tr>
            <th colspan="2"><strong>Tecnología de Control de Arena Instalada</strong></th>
        </tr>

        {{ render_rows($installed, $summary) }}

        {{-- Recommended --}}
        @foreach ($summary->sandControlRecommendations as $i => $recommendation)
            <tr>
                <th colspan="2"><strong>
                  @if ($recommendation->is_new) Nueva Tecnología
                  @else Tecnología Convencional
                  @endif
                  de Control de Arena Recomendada
                </strong></th>
            </tr>
            {{ render_rows($recommended, $recommendation) }}
        @endforeach

        {{-- Remarks --}}
        @if($summary->remarks != null)
            <tr>
                <th colspan="2">Observaciones</th>
            </tr>
            <tr>
                <td colspan="2">{{ $summary->remarks }}</td>
            </tr>
        @endif

        {{-- Wells of Field --}}
        @if (!$wells->isEmpty())
            <tr>
                <th colspan="2">Pozos del campo {{ $field }} con control de arena</th>
            </tr>
            <tr class="row-well"><td colspan="2">
            @foreach ($wells as $well)
                    <div>
                        <a href="/arenas/map/{{ $well->sandControls->first()->id }}">
                            {{ $well->name }}
                        </a>
                    </div>
            @endforeach
            </td></tr>
        @endif
    </tbody>
</table>

@endsection
