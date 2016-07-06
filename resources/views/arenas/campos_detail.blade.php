@extends('layouts.container')

@section('title', 'Control de Arenas - Cuencas')

@section('content')

<div class="page-header">
    <h1>Mecanismo de Control de Arena Sugerido <small>Campo {{ $summary->field->name }}</small></h1>
</div>

@include('partial.messages')

<table class="table-hover">
    <thead>
        <tr>
            <th colspan="2">Características granulométricas de la arena productora en el Campo {{ $summary->field->name }}</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Profundidad Promedio del Intervalo de Interes [ft]</td>
            <td>{{ $summary->interval_avg_len }}</td>
        </tr>
        <tr>
            <td>Coeficiente de uniformidad (U)</td>
            <td>{{ $summary->uniformity }}</td>
        </tr>
        <tr>
            <td>Tamaño de Grano Promedio [Micras]</td>
            <td>{{ $summary->avg_grain_size }}</td>
        </tr>
        <tr>
            <td>Rango Tamaño de Grano [Micras]</td>
            <td>{{ $summary->grain_size_range }}</td>
        </tr>
        <tr>
            <td>Tipo de Arena</td>
            <td>{{ $summary->type }}</td>
        </tr>
        <tr>
            <td>Característica de la arena</td>
            <td>{{ $summary->uniformity_txt }}</td>
        </tr>


        <tr>
            <th colspan="2"><strong>Tipo de Control de Arena Instalado</strong></th>
        </tr>
        <tr>
            <td>Mecanismo Usado</td>
            <td>{{ $summary->installed_mechanism }}</td>
        </tr>
        @if($summary->installed_groove_size != null)
        <tr>
            <td>Ancho de la ranura (in)</td>
            <td>{{ $summary->installed_groove_size}}</td>
        </tr>
        @endif
        @if($summary->installed_grain_size != null)
        <tr>
            <td>Tamaño de grano promedio de grava (in)</td>
            <td>{{ $summary->installed_grain_size }}</td>
        </tr>
        @endif
        @if($summary->installed_us_mesh != null)
        <tr>
            <td>Tamaño Grava US. Mesh</td>
            <td>{{ $summary->installed_us_mesh }}</td>
        </tr>
        @endif
        @foreach ($summary->sandControlRecommendations as $i => $recommendation)
            <tr>
                <th colspan="2"><strong>Tipo de Control de Arena Recomendado @if ($i>0) {{ $i+1 }} @endif</strong></th>
            </tr>
            @if($recommendation->recommended_mechanism != null)
            <tr>
                <td>Mecanismo Recomendado</td>
                <td>{{ $recommendation->recommended_mechanism }}</td>
            </tr>
            @endif
            @if($recommendation->recommended_us_mesh != null)
            <tr>
                <td>Tamaño Grava US. Mesh</td>
                <td>{{ $recommendation->recommended_us_mesh }}</td>
            </tr>
            @endif
        @endforeach
        @if($summary->remarks != null)
            <tr>
                <th colspan="2">Observaciones</th>
            </tr>
            <tr>
                <td colspan="2">{{ $summary->remarks }}</td>
            </tr>
        @endif
        @if (!$wells->isEmpty())
            <tr>
                <th colspan="2">Pozos del campo {{ $summary->field->name }} con control de arena</th>
            </tr>
            <tr class="row-well"><td class="row" colspan="2">
            @foreach ($wells as $well)
                    <div class="col-xs-12 col-md-6 col-lg-4">
                        <a href="{{ url('arenas/map/' . $well->sandControls->first()->id) }}">
                            {{ $well->name }}
                        </a>
                    </div>
            @endforeach
            </td></tr>
        @endif
    </tbody>
</table>

@endsection