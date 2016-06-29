@extends('layouts.master')

@section('title', 'Mapa Fluidos Campos')

@section('head')

    <link href="{{ url('css/map.css') }}" rel="stylesheet" type="text/css">

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
                }
            },
            formatter: labelFormatter,
        }
    },
    legend: {show: false},
};

function labelFormatter(label, series) {
    return '<div style="font-size:8pt; text-align:center; padding:2px; color:black;">'
        + label + '<br/>'
        + Math.round(series.data) + '%'
        + '</div>';
}

var markers_data = {
    title_key: 'name',
    longitude_key: 'longitude',
    latitude_key: 'latitude',
    color_mode: 'none',
    base_url: '{{ url('/') }}',
    data: JSON.parse('{!! $fields !!}'),
    on_open_marker: function(infoWindow, field) {
        var plotId = 'plot_' + field.id;
        var plotHtml = '<div style="width:200px; height:200px;" id="' + plotId + '"></div>';

        var content = infoWindow.getContent();
        content += plotHtml;
        infoWindow.setContent(content);

        var dist = field.distribution;
        var data = [];
        for (var key in dist){
            data.push({label:key, data:dist[key]});
        }
        var $plot = $('#' + plotId);
        $.plot($plot, data, plot_options)
    }
}

Map.load(function(google, map) {
    Map.setupMarkers(markers_data);
});

</script>
@endsection