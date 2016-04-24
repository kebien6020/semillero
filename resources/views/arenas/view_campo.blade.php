@extends('layouts.master')

@section('title', 'Control de Arenas - Cuencas')

@section('content')

<h2>Control de arena en el Campo {{ $campo }}</h2>
<ol>
    @foreach ($sandControls as $key => $sandControl)
    
    <table>
        <thead>
            <tr>
                <th colspan="2">Control de arena {{ $key+1 }}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Profundidad Promedio del Intervalo de Interes [ft]</td>
                <td>{{ $sandControl->interval_depth }}</td>
            </tr>
            <tr>
                <td>Coeficiente de uniformidad (U)</td>
                <td>{{ $sandControl->uniformity_coefficient }}</td>
            </tr>
            <tr>
                <td>Tamaño de Grano Promedio [Micras]</td>
                <td>{{ $sandControl->grain_size }}</td>
            </tr>
            <tr>
                <td>Rango Tamaño de Grano [Micras]</td>
                <td>{{ $sandControl->grain_size_range }}</td>
            </tr>
            <tr>
                <td>Tipo de Arena</td>
                <td>{{ $sandControl->sand_type }}</td>
            </tr>
            <tr>
                <td>Característica de la arena</td>
                <td>{{ $sandControl->sand_uniformity }}</td>
            </tr>


            <tr>
                <td colspan="2"><strong>Tipo de Control Instalado</strong></td>
            </tr>
            <tr>
                <td>Mecanismo Usado</td>
                <td>{{ $sandControl->installed_mechanism }}</td>
            </tr>
            @if($sandControl->installed_groove_thickness != null)
            <tr>
                <td>Ancho de la ranura (in)</td>
                <td>{{ $sandControl->installed_groove_thickness }}</td>
            </tr>
            @endif
            @if($sandControl->installed_gravel_size != null)
            <tr>
                <td>Tamaño de grano promedio de grava (in)</td>
                <td>{{ $sandControl->installed_gravel_size }}</td>
            </tr>
            @endif
            @if($sandControl->installed_gravel_us != null)
            <tr>
                <td>Tamaño Grava US. Mesh</td>
                <td>{{ $sandControl->installed_gravel_us }}</td>
            </tr>
            @endif


            <tr>
                <td colspan="2"><strong>Tipo de Control Recomendado</strong></td>
            </tr>
            @if($sandControl->recommended_mechanism != null)
            <tr>
                <td>Mecanismo Recomendado</td>
                <td>{{ $sandControl->recommended_mechanism }}</td>
            </tr>
            @endif
            @if($sandControl->recommended_groove_thickness != null)
            <tr>
                <td>Ancho de la ranura (in)</td>
                <td>{{ $sandControl->recommended_groove_thickness }}</td>
            </tr>
            @endif
            @if($sandControl->recommended_gravel_size != null)
            <tr>
                <td>Tamaño de grano promedio de grava (in)</td>
                <td>{{ $sandControl->recommended_gravel_size }}</td>
            </tr>
            @endif
            @if($sandControl->recommended_gravel_us != null)
            <tr>
                <td>Tamaño Grava US. Mesh</td>
                <td>{{ $sandControl->recommended_gravel_us }}</td>
            </tr>
            @endif


            <tr>
                <td colspan="2"><strong>Alternativa de Control a partir de Mecanismos Instalados</strong></td>
            </tr>
            @if($sandControl->alternative_mechanism != null)
            <tr>
                <td>Mecanismo Alternativo</td>
                <td>{{ $sandControl->alternative_mechanism }}</td>
            </tr>
            @endif
            @if($sandControl->alternative_groove_thickness != null)
            <tr>
                <td>Ancho de la ranura (in)</td>
                <td>{{ $sandControl->alternative_groove_thickness }}</td>
            </tr>
            @endif
            @if($sandControl->alternative_gravel_size != null)
            <tr>
                <td>Tamaño de grano promedio de grava (in)</td>
                <td>{{ $sandControl->alternative_gravel_size }}</td>
            </tr>
            @endif
            @if($sandControl->alternative_gravel_us != null)
            <tr>
                <td>Tamaño Grava US. Mesh</td>
                <td>{{ $sandControl->alternative_gravel_us }}</td>
            </tr>
            @endif
        </tbody>
    </table>

    @endforeach
</ol>

@endsection