@extends('layouts.container')

@section('title', 'Selección de Control de Arena')

@section('head')

<link rel="stylesheet" href="/css/flot.css">

<script src="{{ url('js/flot.js') }}" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">

$(document).ready(function(){
    var data = {!! $plot_data !!};
    var min = data[0][0] < {{ $x10 }} ? data[0][0] : {{ $x10 }};
    var x10_line = [
        [min       , 10],
        [{{ $x10 }}, 10],
        [{{ $x10 }}, 0 ],
    ];
    var x60_line = [
        [min       , 60],
        [{{ $x60 }}, 60],
        [{{ $x60 }}, 0 ],
    ];
    var x90_line = [
        [min       , 90],
        [{{ $x90 }}, 90],
        [{{ $x90 }}, 0 ],
    ];
    var x50_line = [
        [min       , 50],
        [{{ $x50 }}, 50],
        [{{ $x50 }}, 0 ],
    ];
    var x30_line = [
        [min       , 30],
        [{{ $x30 }}, 30],
        [{{ $x30 }}, 0 ],
    ];
    var options = {
        xaxis: {
            transform: function(v){
                if (v<=0) return 0;
                return Math.log10(v);
            },
            ticks: function(axis){
                var res = []
                for (var i = 0; i < axis.max; i += 100){
                    if (i <= 500)
                        res.push(i);
                    else if (i % 200 == 0)
                        res.push(i);
                }
                return res;
            }
        },
        yaxis: {
            min: 0,
            max: 100,
            ticks: 10
        },
        grid: {
            labelMargin: 10,
            margin: {
                top: 10,
                bottom: 20,
                left: 20
            },
        },
        colors: ['blue', 'gray', 'gray', 'gray', 'gray', 'gray']
    };
    $container = $('.plot');
    $.plot($container, [data, x10_line, x60_line, x90_line, x50_line, x30_line], options);

    // yaxis
    $("<div class='axisLabel yaxisLabel'></div>")
        .text("Porcentaje Acumulado en Peso (%)")
        .appendTo($container);

    // Since CSS transforms use the top-left corner of the label as the transform origin,
    // we need to center the y-axis label by shifting it down by half its width.
    // Subtract 20 to factor the chart's bottom margin into the centering.
    $yLabel = $('.yaxisLabel');
    $yLabel.css("margin-top", $yLabel.width() / 2 - 20);

    // xaxis
    $("<div class='axisLabel xaxisLabel'></div>")
        .text("Tamaño partícula (Micras)")
        .appendTo($container);
});

</script>

@endsection

@section('content')

<div class="page-header">
    <h2>Selección y Configuración de Mecanismos de Control de Arena</h2>
    <h3>{{ $table_name }}</h3>
    <h2><small>Análisis granulométrico</small></h2>
</div>

@if (session()->has('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif

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
        @for($i = 0; $i < count($samples); $i++)
            <tr db-id={{ $samples[$i]->id }} >
                <td>{{ $samples[$i]->grain_size }}</td>
                <td>{{ $samples[$i]->frequency }}</td>
            </tr>
        @endfor
    </tbody>
</table>

<h2 class="header">Curva de distribución granulométrica de la muestra de interés</h2>
<div class="plot">{{-- Placeholder for the plot --}}</div>

<table class="table-hover">
    <thead>
        <tr><th colspan="2">Variables granulométricas calculadas para la selección y diseño de mecanismos de control de arena</th></tr>
    </thead>
    <tbody>
        <tr>
            <td>Tamaño Grano Promedio [Micras]</td>
            <td>{{ round($results->average, 2) }}</td>
        </tr>
        <tr>
            <td>Tipo Grano de la Arena</td>
            <td>{{ $results->grain_type }}</td>
        </tr>
        <tr>
            <td>Percentil D90 (X10)</td>
            <td>{{ round($results->x10, 2) }}</td>
        </tr>
        <tr>
            <td>Percentil D70 (X30)</td>
            <td>{{ round($results->x30, 2) }}</td>
        </tr>
        <tr>
            <td>Percentil D50 (X50)</td>
            <td>{{ round($results->x50, 2) }}</td>
        </tr>
        <tr>
            <td>Percentil D40 (X60)</td>
            <td>{{ round($results->x60, 2) }}</td>
        </tr>
        <tr>
            <td>Percentil D10 (X90)</td>
            <td>{{ round($results->x90, 2) }}</td>
        </tr>
        <tr>
            <td>Coeficiente de uniformidad (U)</td>
            <td>{{ round($results->u, 3) }}</td>
        </tr>
        <tr>
            <td>Uniformidad Arena</td>
            <td>{{ $results->u_txt }}</td>
        </tr>
        <tr>
            <th colspan="2">
                Mecanismos de control de arena sugeridos
            </th>
        </tr>
        <tr>
            <td>Mecanismo de control de arena sugerido 1</td>
            <td><strong>{{ $results->suggested_1 }}</strong></td>
        </tr>
        @if ($results->suggested_2 != null)
        <tr>
            <td>Mecanismo de control de arena sugerido 2</td>
            <td><strong>{{ $results->suggested_2 }}</strong></td>
        </tr>
        @endif
        @if ($results->recommended)
        <tr>
            <td>Tamaño de grava sugerido con base en el criterio de Saucier (in)</td>
            <td>{{ round($results->average_gravel_size, 3) }}</td>
        </tr>
        <tr>
            <td>Tamaño de grava US. Mesh</td>
            <td>{{ $results->us_gravel_mesh }}</td>
        </tr>
        @endif
    </tbody>
</table>
@if ($results->recommended)
<style type="text/css">
    #config_mec tbody tr:last-child td {
        font-weight: bold;
    }
</style>
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