@extends('layouts.master')

@section('title', 'Mapa SLA')

@section('head')

    
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
        var content = '<h2>' + pozo.name + '</h2>' +
            '<p><strong>Fecha de inicio de la Operación: </strong>' + pozo.start_date + '</p>' +
            '<p><strong>Fecha de Finalización de la Operación: </strong>' + pozo.end_date + '</p>' +
            '<p><strong>Siglas del evento: </strong>' + pozo.event + '</p>' +
            '<p><strong>Campo: </strong>' + pozo.field + '</p>' +
            '<p><strong>Departamento: </strong>' + pozo.department + '</p>';
        infoWindows.push(new google.maps.InfoWindow({content: content}));
        markers.push(new google.maps.Marker({
            position: {lng: pozo.longitude, lat: pozo.latitude},
            map: map,
        }));
        markers[i].addListener(
            'click',
            markerListener(i, infoWindows, markers[i], pozo)
        );
        i++;
    }
}

function markerListener(i, infoWindows, marker, pozo){
    return function(){
        for (var info of infoWindows){
            info.close();
        }
        infoWindows[i].open(map, marker);
        $('#field').html(pozo.field);
        $('#east').html(pozo.east);
        $('#north').html(pozo.north);
    }
}

$(document).ready(function(){
    $('option[value="{{ $selected }}"]').attr('selected','selected');
});

    </script>
    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4T9LZ5gwZIHTA550ip33BbLvO9ob1Ji8&callback=initMap"
        type="text/javascript"
        charset="utf-8" async defer></script>

@endsection

@section('content')
    <style type="text/css" media="screen">
        html , body , .main , .content , #map {height: 100%;}
    </style>

    <form method="get" action="/sla/test/map">
        <label for="field">Campo: </label>
        <select name="field">
            <option value="all">Todos</option>
            <option value="YURILLA">YURILLA</option>
            <option value="YAGUARA">YAGUARA</option>
            <option value="TOQUI TOQUI">TOQUI TOQUI</option>
            <option value="VALDIVIA">VALDIVIA</option>
            <option value="TROMPILLOS">TROMPILLOS</option>
            <option value="TOY">TOY</option>
            <option value="TOLDADO">TOLDADO</option>
            <option value="TENAY">TENAY</option>
            <option value="TENAX">TENAX</option>
            <option value="TEMPRANILLO">TEMPRANILLO</option>
            <option value="TELLO">TELLO</option>
            <option value="SANTA CLARA">SANTA CLARA</option>
            <option value="QUIMBAYA">QUIMBAYA</option>
            <option value="PACANDE">PACANDE</option>
            <option value="LOMA LARGA">LOMA LARGA</option>
            <option value="TECA">TECA</option>
            <option value="TANANE">TANANE</option>
            <option value="DINA TERCIARIO">DINA TERCIARIO</option>
            <option value="DINA">DINA</option>
            <option value="CACICA">CACICA</option>
            <option value="BRISAS">BRISAS</option>
            <option value="SUCIO">SUCIO</option>
            <option value="SIBUNDOY">SIBUNDOY</option>
            <option value="SAURIO">SAURIO</option>
            <option value="ARRAYAN">ARRAYAN</option>
            <option value="ANDALUCIA SUR">ANDALUCIA SUR</option>
            <option value="SANTIAGO">SANTIAGO</option>
            <option value="YARIGUI-CANTAGALLO">YARIGUI-CANTAGALLO</option>
            <option value="SAN SILVESTRE">SAN SILVESTRE</option>
            <option value="TISQUIRAMA">TISQUIRAMA</option>
            <option value="SAN FRANCISCO">SAN FRANCISCO</option>
            <option value="TESORO">TESORO</option>
            <option value="SUERTE">SUERTE</option>
            <option value="RIO ZULIA">RIO ZULIA</option>
            <option value="RIO SALDAÑA">RIO SALDAÑA</option>
            <option value="RIO CEIBAS">RIO CEIBAS</option>
            <option value="REFORMA">REFORMA</option>
            <option value="SANTOS">SANTOS</option>
            <option value="SAN ROQUE">SAN ROQUE</option>
            <option value="QUILILI">QUILILI</option>
            <option value="POTRERILLO">POTRERILLO</option>
            <option value="POMPEYA">POMPEYA</option>
            <option value="PIJAO">PIJAO</option>
            <option value="SABANA">SABANA</option>
            <option value="NUTRIA">NUTRIA</option>
            <option value="PALOGRANDE">PALOGRANDE</option>
            <option value="PALMAR">PALMAR</option>
            <option value="PALERMO">PALERMO</option>
            <option value="PACHAQUIARO">PACHAQUIARO</option>
            <option value="LISAMA">LISAMA</option>
            <option value="ORTEGA">ORTEGA</option>
            <option value="LA CIRA">LA CIRA</option>
            <option value="OCOA">OCOA</option>
            <option value="INFANTAS">INFANTAS</option>
            <option value="GARZAS">GARZAS</option>
            <option value="MANSOYA">MANSOYA</option>
            <option value="LORO">LORO</option>
            <option value="GALAN">GALAN</option>
            <option value="LLANITO">LLANITO</option>
            <option value="GALA">GALA</option>
            <option value="EXPLORATORIO">EXPLORATORIO</option>
            <option value="LIBERTAD">LIBERTAD</option>
            <option value="LA JAGUA">LA JAGUA</option>
            <option value="CONDE">CONDE</option>
            <option value="JUNCAL">JUNCAL</option>
            <option value="CICUCO">CICUCO</option>
            <option value="HORMIGA">HORMIGA</option>
            <option value="GUAYURIBA">GUAYURIBA</option>
            <option value="CASABE">CASABE</option>
            <option value="GUARIQUIES">GUARIQUIES</option>
            <option value="CANTAGALLO">CANTAGALLO</option>
            <option value="BONANZA">BONANZA</option>
            <option value="PEÑAS BLANCAS">PEÑAS BLANCAS</option>
            <option value="CASABE SUR">CASABE SUR</option>
            <option value="APURE">APURE</option>
            <option value="SUCUMBIOS">SUCUMBIOS</option>
            <option value="DINA CRETACEO">DINA CRETACEO</option>
            <option value="SAN ANTONIO">SAN ANTONIO</option>
            <option value="QURIYANA">QURIYANA</option>
            <option value="CRISTALINA">CRISTALINA</option>
            <option value="ORITO">ORITO</option>
            <option value="COLORADO">COLORADO</option>
            <option value="COCORNA">COCORNA</option>
            <option value="CHURUYACO">CHURUYACO</option>
            <option value="CARIBE">CARIBE</option>
            <option value="SURIA SUR">SURIA SUR</option>
            <option value="CENCELLA">CENCELLA</option>
            <option value="CEBU">CEBU</option>
            <option value="CASTILLA NORTE">CASTILLA NORTE</option>
            <option value="CASTILLA">CASTILLA</option>
            <option value="SURIA">SURIA</option>
            <option value="MEREY">MEREY</option>
            <option value="LIBERTAD NORTE">LIBERTAD NORTE</option>
            <option value="GUATIQUIA">GUATIQUIA</option>
            <option value="GAVAN">GAVAN</option>
            <option value="CUPIAGUA">CUPIAGUA</option>
            <option value="CHICHIMENE">CHICHIMENE</option>
            <option value="CAÑO SUR  ESTE">CAÑO SUR  ESTE</option>
            <option value="BALCON">BALCON</option>
            <option value="AUSTRAL">AUSTRAL</option>
            <option value="APIAY ESTE">APIAY ESTE</option>
            <option value="ARAUCA">ARAUCA</option>
            <option value="APIAY">APIAY</option>
            <option value="AKACIAS">AKACIAS</option>
            <option value="TIBU">TIBU</option>
            <option value="SARDINATA">SARDINATA</option>
            <option value="ALMAGRO">ALMAGRO</option>
            <option value="ALBORADA">ALBORADA</option>
            <option value="PETROLEA">PETROLEA</option>
            <option value="AGUAS BLANCAS">AGUAS BLANCAS</option>
            <option value="ACAE-SAN MIGUEL(PTO COLON)">ACAE-SAN MIGUEL(PTO COLON)</option>
        </select>
        <input type="submit" name="submit" value="Filtrar">
    </form>

    <table>
        <thead>
            <tr>
                <th>Field</th>
                <th>East</th>
                <th>North</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td id="field"></td>
                <td id="east"></td>
                <td id="north"></td>
            </tr>
        </tbody>
    </table>

    <div id="map" style="height:600px;"></div>

    <form action="/sla/test/map/add_data_submit" method="post">
        {{ csrf_field() }}
        <textarea name="raw-data"></textarea>
        <input type="submit" name="submit" value="Cargar">
    </form>

@endsection
