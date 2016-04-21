@extends('layouts.master')

@section('title', 'Selección de Control de Arenas')

@section('head')

<script src="/js/flot.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">

$(document).ready(function(){
    data = {{ $plot_data }};
    min = data[0][0];
    x10_line = [
        [min       , 10],
        [{{ $x10 }}, 10],
        [{{ $x10 }}, 0 ],
    ];
    x60_line = [
        [min       , 60],
        [{{ $x60 }}, 60],
        [{{ $x60 }}, 0 ],
    ];
    options = {
        xaxis: {
            transform: function(v){
                if (v<=0) return 0;
                return Math.log10(v);
            }
        }
    };
    $.plot('.plot', [data, x10_line, x60_line], options);
});

</script>

@endsection

@section('content')

<h2>Matriz de selección de control de arenas</h2>
<table>
    <thead>
        <tr>
            <th>Tamaño de grano (Xi) [Micras]</th>
            <th>Frecuencia (fi)</th>
            <th>Frecuencia relativa acumulada</th>
        </tr>
    </thead>
    <tbody>
        @for($i = 0; $i < count($samples); $i++)
            <tr db-id={{ $samples[$i]->id }} >
                <td>{{ $samples[$i]->grain_size }}</td>
                <td>{{ $samples[$i]->frequency }}</td>
                <td>{{ sprintf('%.3f', $cummulative_rel_frequency[$i]) }}</td>
            </tr>
        @endfor
    </tbody>
</table>

<div class="plot">{{-- Placeholder for the plot --}}</div>

<table>
    <thead>
        <tr><th colspan="2">Resultados</th></tr>
    </thead>
    <tbody>
        <tr>
            <td>Tamaño Grano Promedio [Micras]</td>
            <td>{{ $results->average }}</td>
        </tr>
        <tr>
            <td>Tipo Grano de la Arena</td>
            <td>{{ $results->grain_type }}</td>
        </tr>
        <tr>
            <td>Percentil D40 (X60)</td>
            <td>{{ $results->x60 }}</td>
        </tr>
        <tr>
            <td>Percentil D90 (X10)</td>
            <td>{{ $results->x10 }}</td>
        </tr>
        <tr>
            <td>Coeficiente de uniformidad (U)</td>
            <td>{{ $results->u }}</td>
        </tr>
        <tr>
            <td>Uniformidad Arena</td>
            <td>{{ $results->u_txt }}</td>
        </tr>
        <tr>
            <td>Mecanismo de control de arena sugerido</td>
            <td><strong>{{ $results->suggested }}</strong></td>
        </tr>
        <tr>
            <td colspan="2">Configuración del Mecanismo</td>
        </tr>
        @if ($results->liner)
            <tr>
                <td>Tamaño de la Ranura [in]</td>
                <td>{{ $results->groove_size }}</td>
            </tr>
        @else {{-- gravel --}}
            <tr>
                <td>Tamaño Grava Promedio [in]</td>
                <td>{{ $results->average_gravel_size }}</td>
            </tr>
            <tr>
                <td>Tamaño Grava US. Mesh</td>
                <td>{{ $results->us_gravel_mesh }}</td>
            </tr>
        @endif
    </tbody>
</table>


@endsection