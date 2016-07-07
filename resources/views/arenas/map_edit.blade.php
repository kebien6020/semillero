@extends('layouts.container')

@section('title', 'Edición de Pozo')

@section('content')

<?php

$elems = [
    [
        'type' => 'text',
        'name' => 'longitude',
        'obj' => $well,
        'display' => 'Longitud'
    ],
    [
        'type' => 'text',
        'name' => 'latitude',
        'obj' => $well,
        'display' => 'Latitud'
    ],
    [
        'type' => 'text',
        'name' => 'install_date',
        'obj' => $sandControl,
        'display' => 'Fecha de Instalación del Mecanismo de Control de Arenas'
    ],
    [
        'type' => 'select',
        'name' => 'event',
        'obj' => $sandControl,
        'display' => 'Siglas del Evento'
    ],
    [
        'type' => 'select',
        'name' => 'mechanism',
        'obj' => $sandControl,
        'display' => 'Mecanismo de Control de Arena'
    ],
    [
        'type' => 'select',
        'name' => 'group',
        'obj' => $sandControl,
        'display' => 'Grupo'
    ],
    [
        'type' => 'select',
        'name' => 'completion_type',
        'obj' => $sandControl,
        'display' => 'Tipo de completamiento según el empaquetamiento de grava'
    ],
    [
        'type' => 'select',
        'name' => 'mesh_type',
        'obj' => $sandControl,
        'display' => 'Tipo de malla'
    ],
    [
        'type' => 'text',
        'name' => 'gravel_size',
        'obj' => $sandControl,
        'display' => 'Tamaño de la Grava (US Mesh)'
    ],
    [
        'type' => 'text',
        'name' => 'grade',
        'obj' => $sandControl,
        'display' => 'Grado'
    ],
    [
        'type' => 'text',
        'name' => 'joints',
        'obj' => $sandControl,
        'display' => 'Número de juntas bajadas'
    ],
    [
        'type' => 'text',
        'name' => 'diameter',
        'obj' => $sandControl,
        'display' => 'Diámetro Nominal (in)'
    ],
    [
        'type' => 'text',
        'name' => 'internal_diameter',
        'obj' => $sandControl,
        'display' => 'Diámetro Interno'
    ],
    [
        'type' => 'text',
        'name' => 'clearance',
        'obj' => $sandControl,
        'display' => 'Holgura (in)'
    ],
    [
        'type' => 'text',
        'name' => 'top',
        'obj' => $sandControl,
        'display' => 'Tope del mecanismo (ft)'
    ],
    [
        'type' => 'text',
        'name' => 'length',
        'obj' => $sandControl,
        'display' => 'Fondo del mecanismo'
    ],
    [
        'type' => 'text',
        'name' => 'bottom',
        'obj' => $sandControl,
        'display' => 'Longitud (ft)'
    ],
    [
        'type' => 'text',
        'name' => 'weight',
        'obj' => $sandControl,
        'display' => 'Peso Nominal (lb/ft)'
    ],
    [
        'type' => 'text',
        'name' => 'slots_per_feet',
        'obj' => $sandControl,
        'display' => 'Número de ranuras por pie'
    ],
    [
        'type' => 'text',
        'name' => 'slot_width',
        'obj' => $sandControl,
        'display' => 'Ancho de la ranura del liner (in)'
    ],
    [
        'type' => 'text',
        'name' => 'mesh',
        'obj' => $sandControl,
        'display' => 'Mesh'
    ],
    [
        'type' => 'text',
        'name' => 'slot_gauge',
        'obj' => $sandControl,
        'display' => 'Slot Gauge de la malla (in)'
    ],
    [
        'type' => 'text',
        'name' => 'ideal_size',
        'obj' => $sandControl,
        'display' => 'Tamaño de grano ideal para completar  con el pozo con el mecanismo de control seleccionado (micrómetros)'
    ],
];

?>

<header>
    <h1>Sección de edición de la información del pozo {{ ufirst($well->name) }}</h1>
</header>

@include('partial.messages')

<form action="/arenas/map/{{ $well->id }}" class="form-2-10" method="POST">
    {{ method_field('PUT') }}
    {{ csrf_field() }}

    @foreach ($elems as $elem)
        <div class="form-group">
        <?php
            $elem = (object) $elem;
            $val = $elem->obj->{$elem->name};
        ?>
        <label for="{{ $elem->name }}">{{ $elem->display }}: </label>
        @if ($elem->type === 'text')
            <input type="text"
                   name="{{ $elem->name }}"
                   value="{{ old($elem->name) ?: $val ?: '-' }}">
        @else
            {{ $generate_select($elem->name, old($elem->name) ?: $val) }}
        @endif
        </div>
    @endforeach
    
    <div class="submit-container">
        <input type="submit" name="submit" value="Actualizar">
    </div>
</form>

@endsection