@extends('layouts.master')

@section('title', 'Mapa Fluidos Campos')

@section('head')

    <link href="{{ url('css/map.css') }}" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="/css/fluidos_map_campos.css">

@endsection

@section('content')

@if (session()->has('success'))
    <div class="alert alert-success">{!! session('success') !!}</div>
@endif

<div id="map"></div>
<div class="buttons">
    <a href="{{ url('fluidos/table_upload/fluidos_rangos') }}" class="btn btn-primary">
        Importar Datos
    </a>
</div>

<div id="fullscreen-overlay">
    <div id="white-overlay">
        <h1 id="overlay-title"></h1>
        <div class="horizontal-container">
            <div class="left-container">
                <h4>Distribución de fluidos</h4>
                <div id="left-plot"></div>
            </div>
            <div class="right-container">
                <h4>Distribución de densidades</h4>
                <div id="right-plot"></div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('script', 'fluidos_map_campos')

@section('custom-script')
<script type="text/javascript">

var plot_options = {
    series: {
        pie: {
            show: true,
            radius: 1,
            label: {
                radius: 3/4,
                show: true,
                background: {
                    opacity: 0.5,
                    color: "#000"
                },
                formatter: labelFormatter,
            },
        }
    },
    legend: {show: false},
    grid: {
        hoverable: true,
        clickable: true,
    }
};

function labelFormatter(label, series) {
    return '<div style="font-size:8pt; text-align:center; padding:2px; color:white;">'
        + label + '<br/>'
        + series.data[0][1] + ' ('
        + Math.round(series.percent) + '%'
        + ')'
        + '</div>';
}

function setupRightPlot($right_plot, field_id, fluid_id) {
    $right_plot.empty();
    $.getJSON('/api/fluidos/density_dist/' + field_id + '/' + fluid_id)
     .done(function(data){
        if (data.ranges.length < 1){
            $right_plot.html('<p class="error">No hay informacion</p>');
        } else {
            var plot_data = [];
            for (var range of data.ranges) {
                plot_data.push({
                    label: range.range,
                    data: range.occurrences
                });
            }
            $.plot($right_plot, plot_data, plot_options);
        }
        $('#overlay-title').html('Campo ' + data.field_name);
     })
     .fail(function(){
        $right_plot.html('<p class="error">Error comunicandose al servidor</p>');
     });
}

var markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'none',
    base_url: '{{ url('/') }}',
    data: JSON.parse('{!! $fields !!}'),
    on_open_marker: function(infoWindow, field) {
        // Infowindow
        var plotId = 'plot_' + field.id;
        if ($('#' + plotId).length > 0) return;

        var plotHtml = '<div style="width:250px; height:250px;" id="' + plotId + '"></div>';

        var content = infoWindow.getContent();
        content += plotHtml;
        infoWindow.setContent(content);

        var dist = field.distribution;
        var data = [];
        for (var fluid of dist){
            data.push({
                label: fluid.name,
                data: fluid.occurrences,
                color: fluid.color,
                fluid_id: fluid.id
            });
        }
        var $plot = $('#' + plotId);
        $.plot($plot, data, plot_options);
        $plot.data('field', field.id);

        // Overlay
        $plot.bind('plotclick', function(event, pos, obj) {
            var field_id = $(this).data('field');
            var fluid_id = obj.series.fluid_id;
            var $overlay = $('#fullscreen-overlay');
            var $left_plot = $overlay.find('#left-plot');
            var $right_plot = $overlay.find('#right-plot');
            $('#overlay-title').html('&nbsp;');
            $overlay.fadeIn();
            // Left plot contents
            $.plot($left_plot, data, plot_options);
            // Right plot contents
            setupRightPlot($right_plot, field_id, fluid_id);
                //console.log(field_id + ' ' + obj.series.fluid_id)
            $left_plot.bind('plotclick', function(event, pos, obj){
                console.log(field_id + ' ' + obj.series.fluid_id)
                setupRightPlot($right_plot, field_id, obj.series.fluid_id);
            });
        });
    }
}

$('#fullscreen-overlay').click(function(event){
    if ($(this)[0] === event.target){
        $(this).fadeOut();
        $('#left-plot').unbind('plotclick');
    }
});

Map.load(function(google, map) {
    Map.setupMarkers(markers_data);
});

</script>
@endsection