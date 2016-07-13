@extends('layouts.container')

@section('title', 'Información general del completamiento del pozo')

@section('content')
<?php

$elems = [
    [
        'display' => 'Mecanismo de control de arena',
        'content' => $sandControl->mechanism
    ],
    [
        'display' => 'Vicepresidencia',
        'content' => $sandControl->well->field->vicepresidency
    ],
    [
        'display' => 'Nombre del Campo',
        'content' => $sandControl->well->field->name
    ],
    [
        'display' => 'Nombre del Pozo',
        'content' => $sandControl->well->name
    ],
    [
        'display' => 'Fecha de instalación del mecanismo de control de arena',
        'content' => $sandControl->install_date
    ],
    [
        'display' => 'Siglas del evento',
        'content' => $sandControl->event
    ],
    [
        'display' => 'Tipo de Completamiento según el empaquetamiento de grava',
        'content' => $sandControl->completion_type
    ],
    [
        'display' => 'Tipo de malla',
        'content' => $sandControl->mesh_type
    ],
    [
        'display' => 'Tamaño de la Grava (US Mesh)',
        'content' => $sandControl->gravel_size
    ],
    [
        'display' => 'Grado del revestimiento',
        'content' => $sandControl->grade
    ],
    [
        'display' => 'BHA (Número de Juntas)',
        'content' => $sandControl->joints
    ],
    [
        'display' => 'Diámetro Nominal del revestimiento (in)',
        'content' => $sandControl->diameter
    ],
    [
        'display' => 'Diámetro Interno del revestimiento (in)',
        'content' => $sandControl->internal_diameter
    ],
    [
        'display' => 'Holgura (in)',
        'content' => $sandControl->clearance
    ],
    [
        'display' => 'Tope del mecanismo (ft)',
        'content' => $sandControl->top
    ],
    [
        'display' => 'Fondo del mecanismo',
        'content' => $sandControl->bottom
    ],
    [
        'display' => 'Longitud (ft)',
        'content' => $sandControl->length
    ],
    [
        'display' => 'Peso Nominal (lb/ft)',
        'content' => $sandControl->weight
    ],
    [
        'display' => 'Municipio',
        'content' => $sandControl->well->town
    ],
    [
        'display' => 'Número de ranuras por pie',
        'content' => $sandControl->slots_per_ft
    ],
    [
        'display' => 'Ancho de la ranura del Liner (in)',
        'content' => $sandControl->slot_width
    ],
    [
        'display' => 'Mesh',
        'content' => $sandControl->mesh
    ],
    [
        'display' => 'Slot Gauge de la malla (in)',
        'content' => $sandControl->slot_gauge
    ],
];

$well_name = ufirst($sandControl->well->name);

?>

<header>
    <h1>Información general del Pozo {{ $well_name }}</h1>
</header>

@include('partial.messages')


<p>A continuación se muestra la información relacionada con mecanismos de control de arena del pozo de interés</p>
<table class="table-hover">
    <thead>
        <tr>
            <th colspan="2">Pozo {{ $well_name }}</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($elems as $elem)
            @if ($elem['content'] != null)
            <tr>
                <td>{{ $elem['display'] }}</td>
                <td>{{ $elem['content'] }}</td>
            </tr>
            @endif
        @endforeach
    </tbody>
</table>

<div class="buttons">
    <a href="/arenas/map/{{ $sandControl->id }}/edit">
        Editar
    </a>
</div>

@endsection