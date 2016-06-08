@extends('layouts.master')

@section('title', 'Mapa Arenas Pozos')

@section('head')

    <link href="/css/map.css" rel="stylesheet" type="text/css">

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
        content += '<p><strong>Mecanismo de control de arena: </strong>';
        content += sandControl.mechanism + '</p>';

        content += '<p><strong>Fecha de instalación del mecanismo de control de arena: </strong>';
        content += sandControl.install_date + '</p>';

        content += '<p><strong>Campo: </strong>';
        content += sandControl.well.field.name + '</p>';

        if (sandControl.event){
            content += '<p><strong>Siglas del evento: </strong>';
            content += sandControl.event + '</p>';
        }
        content += '<p style="text-align: center;">'
        content += '<a href="/arenas/map/' + sandControl.id;
        content += '">Mas detalles</a>' + '|';
        content += '<a href="/arenas/map/' + sandControl.well.id + '/edit';
        content += '">Editar</a>';

        infoWindows.push(new google.maps.InfoWindow({content: content}));

        var color = colors[sandControl.group];
        markers.push(new google.maps.Marker({
            position: {
                lng: sandControl.well.longitude,
                lat: sandControl.well.latitude
            },
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
        $('#legend').append(
            '<p style="padding:0;margin:0;">'
            + '<img width="11" height="20" src="'
            + getIcon(colors[mechanism]) + '">'
            + mechanism +'</p>');
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
