@extends('layouts.container')

@section('title', 'Información general del completamiento del pozo')

@section('content')

<div class="page-header">
    <h2>Información general del Pozo {{ ucfirst(strtolower($sandControl->well->name)) }}</h2>
</div>

<p>A continuación se muestra la información relacionada con mecanismos de control de arena del pozo de interés</p>
<table class="table-hover">
    <thead>
        <tr>
            <th colspan="2">Pozo {{ ucfirst(strtolower($sandControl->well->name)) }}</th>
        </tr>
    </thead>
    <tbody>
        @if ( $sandControl->mechanism != null)
        <tr>
            <td>Mecanismo de control de arena</td>
            <td>{{ $sandControl->mechanism }}</td>
        </tr>
        @endif
        @if ( $sandControl->well->field->vicepresidency != null)
        <tr>
            <td>Vicepresidencia</td>
            <td>{{ $sandControl->well->field->vicepresidency }}</td>
        </tr>
        @endif
        @if ( $sandControl->well->field->name != null)
        <tr>
            <td>Nombre del Campo</td>
            <td>{{ $sandControl->well->field->name }}</td>
        </tr>
        @endif
        @if ( $sandControl->well->name != null)
        <tr>
            <td>Nombre del Pozo</td>
            <td>{{ $sandControl->well->name }}</td>
        </tr>
        @endif
        @if ( $sandControl->install_date != null)
        <tr>
            <td>Fecha de instalación del mecanismo de control de arena</td>
            <td>{{ $sandControl->install_date }}</td>
        </tr>
        @endif
        @if ( $sandControl->event != null)
        <tr>
            <td>Siglas del evento</td>
            <td>{{ $sandControl->event }}</td>
        </tr>
        @endif
        @if ( $sandControl->completion_type != null)
        <tr>
            <td>Tipo de Completamiento según el empaquetamiento de grava</td>
            <td>{{ $sandControl->completion_type }}</td>
        </tr>
        @endif
        @if ( $sandControl->mesh_type != null)
        <tr>
            <td>Tipo de malla</td>
            <td>{{ $sandControl->mesh_type }}</td>
        </tr>
        @endif
        @if ( $sandControl->gravel_size != null)
        <tr>
            <td>Tamaño de la Grava (US Mesh)</td>
            <td>{{ $sandControl->gravel_size }}</td>
        </tr>
        @endif
        @if ( $sandControl->grade != null)
        <tr>
            <td>Grado</td>
            <td>{{ $sandControl->grade }}</td>
        </tr>
        @endif
        @if ( $sandControl->joints != null)
        <tr>
            <td>BHA (Número de Juntas)</td>
            <td>{{ $sandControl->joints }}</td>
        </tr>
        @endif
        @if ( $sandControl->diameter != null)
        <tr>
            <td>Diámetro Nominal (in)</td>
            <td>{{ $sandControl->diameter }}</td>
        </tr>
        @endif
        @if ( $sandControl->internal_diameter != null)
        <tr>
            <td>Diámetro Interno</td>
            <td>{{ $sandControl->internal_diameter }}</td>
        </tr>
        @endif
        @if ( $sandControl->clearance != null)
        <tr>
            <td>Holgura (in)</td>
            <td>{{ $sandControl->clearance }}</td>
        </tr>
        @endif
        @if ( $sandControl->top != null)
        <tr>
            <td>Tope del mecanismo (ft)</td>
            <td>{{ $sandControl->top }}</td>
        </tr>
        @endif
        @if ( $sandControl->bottom != null)
        <tr>
            <td>Fondo del mecanismo</td>
            <td>{{ $sandControl->bottom }}</td>
        </tr>
        @endif
        @if ( $sandControl->length != null)
        <tr>
            <td>Longitud (ft)</td>
            <td>{{ $sandControl->length }}</td>
        </tr>
        @endif
        @if ( $sandControl->weight != null)
        <tr>
            <td>Peso Nominal (lb/ft)</td>
            <td>{{ $sandControl->weight }}</td>
        </tr>
        @endif
        @if ( $sandControl->well->town != null)
        <tr>
            <td>Municipio</td>
            <td>{{ $sandControl->well->town }}</td>
        </tr>
        @endif
        @if ( $sandControl->slots_per_ft != null)
        <tr>
            <td>Número de ranuras por pie</td>
            <td>{{ $sandControl->slots_per_ft }}</td>
        </tr>
        @endif
        @if ( $sandControl->slot_width != null)
        <tr>
            <td>Ancho de la ranura del Liner  (in)</td>
            <td>{{ $sandControl->slot_width }}</td>
        </tr>
        @endif
        @if ( $sandControl->mesh != null)
        <tr>
            <td>Mesh</td>
            <td>{{ $sandControl->mesh }}</td>
        </tr>
        @endif
        @if ( $sandControl->slot_gauge != null)
        <tr>
            <td>Slot Gauge de la malla (in)</td>
            <td>{{ $sandControl->slot_gauge }}</td>
        </tr>
        @endif
        {{--
        @if ( $sandControl->ideal_size != null)
        <tr>
            <td>Tamaño de grano ideal para completar  con el pozo con el mecanismo de conntrol seleccionado (micrómetros)</td>
            <td>{{ $sandControl->ideal_size }}</td>
        </tr>
        @endif
        @if ( $field_avg_len != null)
        <tr>
            <td>Longitud Promedio del mecanismo en el Campo (ft)</td>
            <td>{{ $field_avg_len }}</td>
        </tr>
        @endif --}}
    </tbody>
</table>

<div class="buttons">
    <a href="{{ url('arenas/map/' . $sandControl->id) }}/edit" class="btn btn-primary">
        Editar
    </a>
</div>

@endsection