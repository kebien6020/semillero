@extends('layouts.master')

@section('title', 'Control de Arenas - Detalle de Pozo')

@section('content')

<h2>Pozo {{ $pozo->name }}</h2>
<table>
    <thead>
        <tr>
            <th colspan="2">Control de Arenas en el pozo {{ $pozo->name }}</th>
        </tr>
    </thead>
    <tbody>
        @if ( $pozo->mechanism != null)
        <tr>
            <td>Mecanismo de control de arena</td>
            <td>{{ $pozo->mechanism }}</td>
        </tr>
        @endif
        @if ( $pozo->arenas_campo->vicepresidency != null)
        <tr>
            <td>Vicepresidencia</td>
            <td>{{ $pozo->arenas_campo->vicepresidency }}</td>
        </tr>
        @endif
        @if ( $pozo->arenas_campo->name != null)
        <tr>
            <td>Nombre del Campo</td>
            <td>{{ $pozo->arenas_campo->name }}</td>
        </tr>
        @endif
        @if ( $pozo->name != null)
        <tr>
            <td>Nombre del Pozo</td>
            <td>{{ $pozo->name }}</td>
        </tr>
        @endif
        @if ( $pozo->install_date != null)
        <tr>
            <td>Fecha de instalación del mecanismo de control de arena</td>
            <td>{{ $pozo->install_date }}</td>
        </tr>
        @endif
        @if ( $pozo->event != null)
        <tr>
            <td>Siglas del evento</td>
            <td>{{ $pozo->event }}</td>
        </tr>
        @endif
        @if ( $pozo->completion_type != null)
        <tr>
            <td>Tipo de Completamiento según el empaquetamiento de grava</td>
            <td>{{ $pozo->completion_type }}</td>
        </tr>
        @endif
        @if ( $pozo->mesh_type != null)
        <tr>
            <td>Tipo de malla</td>
            <td>{{ $pozo->mesh_type }}</td>
        </tr>
        @endif
        @if ( $pozo->gravel_us != null)
        <tr>
            <td>Tamaño de la Grava (US Mesh)</td>
            <td>{{ $pozo->gravel_us }}</td>
        </tr>
        @endif
        @if ( $pozo->grade != null)
        <tr>
            <td>Grado</td>
            <td>{{ $pozo->grade }}</td>
        </tr>
        @endif
        @if ( $pozo->joints != null)
        <tr>
            <td>Número de juntas bajadas</td>
            <td>{{ $pozo->joints }}</td>
        </tr>
        @endif
        @if ( $pozo->diameter != null)
        <tr>
            <td>Diámetro Nominal (in)</td>
            <td>{{ $pozo->diameter }}</td>
        </tr>
        @endif
        @if ( $pozo->internal_diameter != null)
        <tr>
            <td>Diámetro Interno</td>
            <td>{{ $pozo->internal_diameter }}</td>
        </tr>
        @endif
        @if ( $pozo->clearance != null)
        <tr>
            <td>Holgura (in)</td>
            <td>{{ $pozo->clearance }}</td>
        </tr>
        @endif
        @if ( $pozo->top != null)
        <tr>
            <td>Tope del mecanismo (ft)</td>
            <td>{{ $pozo->top }}</td>
        </tr>
        @endif
        @if ( $pozo->length != null)
        <tr>
            <td>Longitud (ft)</td>
            <td>{{ $pozo->length }}</td>
        </tr>
        @endif
        @if ( $pozo->bottom != null)
        <tr>
            <td>Fondo del mecanismo</td>
            <td>{{ $pozo->bottom }}</td>
        </tr>
        @endif
        @if ( $pozo->weight != null)
        <tr>
            <td>Peso Nominal (lb/ft)</td>
            <td>{{ $pozo->weight }}</td>
        </tr>
        @endif
        @if ( $pozo->north != null)
        <tr>
            <td>Norte (m)</td>
            <td>{{ $pozo->north }}</td>
        </tr>
        @endif
        @if ( $pozo->east != null)
        <tr>
            <td>Este(m)</td>
            <td>{{ $pozo->east }}</td>
        </tr>
        @endif
        @if ( $pozo->town != null)
        <tr>
            <td>Municipio</td>
            <td>{{ $pozo->town }}</td>
        </tr>
        @endif
        @if ( $pozo->slots_per_ft != null)
        <tr>
            <td>Número de ranuras por pie</td>
            <td>{{ $pozo->slots_per_ft }}</td>
        </tr>
        @endif
        @if ( $pozo->slot_width != null)
        <tr>
            <td>Ancho de la ranura del Liner  (in)</td>
            <td>{{ $pozo->slot_width }}</td>
        </tr>
        @endif
        @if ( $pozo->mesh != null)
        <tr>
            <td>Mesh</td>
            <td>{{ $pozo->mesh }}</td>
        </tr>
        @endif
        @if ( $pozo->slot_gauge != null)
        <tr>
            <td>Slot Gauge de la malla (in)</td>
            <td>{{ $pozo->slot_gauge }}</td>
        </tr>
        @endif
        @if ( $pozo->ideal_size != null)
        <tr>
            <td>Tamaño de grano ideal para completar  con el pozo con el mecanismo de conntrol seleccionado (micrómetros)</td>
            <td>{{ $pozo->ideal_size }}</td>
        </tr>
        @endif
        @if ( $pozo->average_length != null)
        <tr>
            <td>Longitud Promedio del mecanismo por Campo (ft)</td>
            <td>{{ $pozo->arenas_campo->average_length }}</td>
        </tr>
        @endif
    </tbody>
</table>


@endsection