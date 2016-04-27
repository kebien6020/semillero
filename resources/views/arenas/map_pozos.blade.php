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
var pozos = {!! $pozos !!};

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
    for (var pozo of pozos){
        var content = '<h2>' + pozo.name + '</h2>';
        content += '<p><strong>Mecanismo de control de arena: </strong>' + pozo.mechanism + '</p>';
        content += '<p><strong>Fecha de instalación del mecanismo de control de arena: </strong>' + pozo.install_date + '</p>';
        content += '<p><strong>Campo: </strong>' + pozo.arenas_campo.name + '</p>';
        if (pozo.event)
            content += '<p><strong>Siglas del evento: </strong>' + pozo.event + '</p>';
        content += '<p style="text-align: center;"><a href="/arenas/map/' + pozo.id + '">Mas detalles</a>';
        infoWindows.push(new google.maps.InfoWindow({content: content}));
        markers.push(new google.maps.Marker({
            position: {lng: pozo.longitude, lat: pozo.latitude},
            map: map,
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

    </script>

@endsection

@section('content')
    <style type="text/css" media="screen">
        html , body , .main , .content , #map {height: 100%;}
    </style>

    <div id="map" style="height:100%;"></div>

@endsection
