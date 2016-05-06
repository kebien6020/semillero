@extends('layouts.master')

@section('title', 'Mapa de Fluidos de Completamiento')

@section('head')

<script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8&callback=initMap"
        type="text/javascript"
        charset="utf-8" async defer></script>

@endsection

@section('content')

<p>Aquí va a ir mapa de fluidos de completamiento. Por ahora aqui estan los datos por campo:</p>

<script>
$(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});

var map;
function initMap(){
	//Map
    var options = {
        center: {lng:-73, lat:4},
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.HYBRID,
    };
    var $div_map = document.getElementById('map');
    map = new google.maps.Map($div_map, options);
}
</script>

<table>
    <thead>
        <tr>
            <th>Campo</th>
            <th>No. Pozos</th>
        </tr>
    </thead>
    <tbody>
        @foreach($campos as $campo)
            <tr class="clickable-row" data-href="/fluidos/map/campos/{{ $campo->id }}">
                <td>{{ $campo->name }}</td>
                <td>{{ $campo->number_wells }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
<div id="map" style="width:600px; height:400px;"></div>

<form action="/fluidos/map/campos_add_data_submit" method="post">
    {{ csrf_field() }}
    <textarea name="raw_data"></textarea>
    <input type="submit" value="Cargar">
</form>

@endsection
