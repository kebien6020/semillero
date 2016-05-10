@extends('layouts.master')

@section('title', 'Mapa Fluidos Campos')

@section('head')

    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8&callback=initMap"
        type="text/javascript"
        charset="utf-8" async defer></script>
    <script src="/js/flot.js" type="text/javascript" charset="utf-8" async defer></script>
    <script type="text/javascript">

var map;
var fields = JSON.parse('{!! $fields !!}');
var plotOptions = {
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

function initMap(){  // Called in asynchronous callback
    //Map
    var options = {
        center: {lng:-73, lat:4},
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.HYBRID,
    };
    var $div_map = document.getElementById('map');
    map = new google.maps.Map($div_map, options);

    //Markers
    var i = 0;
    var infoWindows = [];
    var markers = [];
    for (var field of fields){
        var content = '<h2>' + field.name + '</h2>';
        var plotId = 'plot_' + field.id;
        content += '<div style="width:200px; height:200px;" id="' + plotId + '"></div>';

        infoWindows.push(new google.maps.InfoWindow({content: content}));
        markers.push(new google.maps.Marker({
            position: {lng: field.longitude, lat: field.latitude},
            map: map,
        }));
        markers[i].addListener(
            'click',
            markerListener(i, infoWindows, markers[i], plotId, field.distribution)
        );
        i++;
    }
}

function markerListener(i, infoWindows, marker, plotId, plotData){
    return function(){
        for (var info of infoWindows){
            info.close();
        }
        infoWindows[i].open(map, marker);
        var data = [];
        for (var key in plotData){
            data.push({label:key, data:plotData[key]});
        }
        $.plot('#' + plotId, data, plotOptions);
    }
}

function labelFormatter(label, series) {
    return "<div style='font-size:8pt; text-align:center; padding:2px; color:black;'>" + label + "<br/>" + Math.round(series.data) + "%</div>";
}

    </script>

@endsection

@section('content')

    <div id="map" style="height:600px;"></div>
    
    <div class="button-container">
        <a href="/fluidos/table_upload/fluidos_pozos" class="fancy-button-small">
            Cargar datos
        </a>
    </div>

@endsection