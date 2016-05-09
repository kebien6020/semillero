@extends('layouts.master')

@section('title', 'Mapa Arenas Pozos')

@section('head')

    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8&callback=initMap"
        type="text/javascript"
        charset="utf-8" async defer></script>
    <script src="/js/flot.js" type="text/javascript" charset="utf-8" async defer></script>
    <script type="text/javascript">

var map;
var sandControls = {!! $sandControls !!};
var groups = {!! $groups !!};
var colors_base = ['red', 'orange', 'yellow', 'aqua', 'blue', 'purple', 'gray'];
var colors = {};
for (var i = 0; i < groups.length; ++i)
{
    var j = i;
    if (i >= colors_base.length)
        j = colors_base.length - 1;
    colors[groups[i]] = colors_base[j];
}

function getIcon(color){
    return '/images/spotlight-poi-' + color + '.png';
}

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
    for (var sandControl of sandControls){
        var content = '<h2>' + sandControl.well.name + '</h2>';
        content += '<p><strong>Mecanismo de control de arena: </strong>' + sandControl.mechanism + '</p>';
        content += '<p><strong>Fecha de instalación del mecanismo de control de arena: </strong>' + sandControl.install_date + '</p>';
        content += '<p><strong>Campo: </strong>' + sandControl.well.field.name + '</p>';
        if (sandControl.event)
            content += '<p><strong>Siglas del evento: </strong>' + sandControl.event + '</p>';
        content += '<p style="text-align: center;"><a href="/arenas/map/' + sandControl.id + '">Mas detalles</a>';
        infoWindows.push(new google.maps.InfoWindow({content: content}));

        var color = colors[sandControl.group];
        markers.push(new google.maps.Marker({
            position: {lng: sandControl.well.longitude, lat: sandControl.well.latitude},
            map: map,
            icon: getIcon(color),
        }));
        markers[i].addListener(
            'click',
            markerListener(i, infoWindows, markers[i])
        );
        i++;
    }
}

/* This will be in the map for fluids
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
            }
        }
    },
    legend: {show: false},
};
*/

function markerListener(i, infoWindows, marker){
    return function(){
        for (var info of infoWindows){
            info.close();
        }
        infoWindows[i].open(map, marker);
    }
}

$(document).ready(function(){
    for (var mechanism in colors){
        $('#legend').append('<p style="padding:0;margin:0;"><img width="11" height="20" src="' + getIcon(colors[mechanism]) +'">'+ mechanism +'</p>');
    }
});

    </script>

@endsection

@section('content')

    <div style="position:relative">
        <div id="legend" style="position:absolute; top:0; right:0; width:20%; background-color:white;font-size:8pt; padding:5px; z-index:2;"></div>
        <div id="map" style="height:600px;"></div>
    </div>
    <div class="button-container">
        <a href="/arenas/table_upload/arenas_pozos" class="fancy-button-small">
            Cargar datos
        </a>
    </div>

@endsection
