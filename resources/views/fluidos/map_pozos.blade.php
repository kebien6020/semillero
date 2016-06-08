@extends('layouts.master')

@section('title', 'Mapa Fluidos Pozos')

@section('head')

    <link href="/css/map.css" rel="stylesheet" type="text/css">

    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8&callback=initMap"
        type="text/javascript"
        charset="utf-8" async defer></script>
    <script src="/js/flot.js" type="text/javascript" charset="utf-8" async defer></script>
    <script type="text/javascript">

var map;
var occurrences = JSON.parse('{!! $occurrences !!}');
var fluids = JSON.parse('{!! $fluids !!}');

function getIconUrl(color){
    // Expand from shorthand
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    if (color.length == 7)
        color = color.slice(1);
    // Pin image from google itself
    return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + color;
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
    for (var occurrence of occurrences){
        var content = '<h2>' + occurrence.well.name + '</h2>';
        content += '<p><strong>Fluido de completamiento: </strong>' + occurrence.fluid.name + '</p>';
        if (occurrence.density != null)
            content += '<p><strong>Densidad del fluido: </strong>' + occurrence.density + '</p>';
        content += '<p><strong>Fecha de inicio: </strong>' + occurrence.start_date + '</p>';
        content += '<p><strong>Campo: </strong>' + occurrence.well.field.name + '</p>';
        if (occurrence.event)
            content += '<p><strong>Siglas del evento: </strong>' + occurrence.event + '</p>';
        infoWindows.push(new google.maps.InfoWindow({content: content}));

        var iconUrl = getIconUrl(occurrence.fluid.color);
        var icon = makePin(iconUrl);
        markers.push(new google.maps.Marker({
            position: {lng: occurrence.well.longitude, lat: occurrence.well.latitude},
            map: map,
            icon: icon,
        }));
        markers[i].addListener(
            'click',
            markerListener(i, infoWindows, markers[i])
        );
        i++;
    }
    function makePin(url){
        return {
            url: url,
            size: google.maps.Size(21, 34),
            origin: google.maps.Point(0,0),
            anchor: google.maps.Point(10, 34),
        };
    }
}

function markerListener(i, infoWindows, marker){
    return function(){
        for (var info of infoWindows){
            info.close();
        }
        infoWindows[i].open(map, marker);
    }
}

$(document).ready(function(){
    for (var fluid of fluids){
        $('#legend')
            .append('<p style="padding:0;margin:0;"><img width="11" height="20" src="' +
                getIconUrl(fluid.color) +'">'+ fluid.name +'</p>');
    }
});

    </script>

@endsection

@section('content')

<div id="legend"></div>
<div id="map"></div>
<div class="buttons">
    <a href="/arenas/table_upload/arenas_pozos" class="btn btn-primary">
        Cargar tabla
    </a>
    <a href="#" class="btn btn-primary">
        Añadir pozo
    </a>
</div>

@endsection
