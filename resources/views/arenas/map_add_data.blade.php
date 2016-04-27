@extends('layouts.master')

@section('title', 'Mapa Arenas Pozos - Insertar datos')

@section('content')
<p>Los datos se ingresan copiando desde Excel una tabla con las siguientes columnas:</p>
<ol>
    <li>Vicepresidencia</li>
    <li>Nombre del Campo</li>
    <li>Nombre del Pozo</li>
    <li>Fecha de instalación del mecanismo de control de arena</li>
    <li>Siglas del evento</li>
    <li>Mecanismo de control de arena</li>
    <li>Tipo de Completamiento según el empaquetamiento de grava</li>
    <li>Tipo de malla</li>
    <li>Tamaño de la Grava ( US Mesh)</li>
    <li>Grado</li>
    <li>Número de juntas bajadas</li>
    <li>Diámetro Nominal (in)</li>
    <li>Diámetro Interno</li>
    <li>Holgura (in)</li>
    <li>Tope del mecanismo (ft)</li>
    <li>Longitud (ft)</li>
    <li>Fondo del mecanismo</li>
    <li>Peso Nominal (lb/ft)</li>
    <li>Norte (m)</li>
    <li>Este(m)</li>
    <li>Municipio</li>
    <li>Número de ranuras por pie</li>
    <li>Ancho de la ranura del Liner  (in)</li>
    <li>Mesh</li>
    <li>Slot Gauge de la malla (in)</li>
    <li>Tamaño de grano ideal para completar  con el pozo con el mecanismo de conntrol seleccionado (micrómetros)</li>
    <li>Longitud Promedio del mecanismo por Campo (ft)</li>
</ol>
<form id="the-form" action="/arenas/map_add_data_submit" method="post" accept-charset="utf-8">
    {{ csrf_field() }}
    <textarea name="raw-data"></textarea>
    <input type="submit" name="submit" value="Cargar">
</form>

@endsection