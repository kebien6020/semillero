@extends('layouts.master')

@section('title', 'Control de Arenas por Campos - Insertar datos')

@section('head')

<script type="text/javascript">

$(document).ready({
    $('#the-form').submit(function(event){
        event.preventDefault();
        var $textarea = $(this).children('textarea[name="raw-data"]');
        var data = $textarea.val().split('\n');
    });
});

</script>

@endsection

@section('content')

<h2>Ingreso de datos por campo</h2>
<p>Los datos se ingresan copiando desde Excel una tabla con las siguientes columnas:</p>
<ol>
    <li>Profundidad Promedio del Intervalo de Interes [ft]</li>
    <li>Nombre del Campo</li>
    <li>Cuenca Campo</li>
    <li>Coeficiente de uniformidad (U)</li>
    <li>Tamaño de Grano Promedio [Micras]</li>
    <li>Rango Tamaño de Grano [Micras]</li>
    <li>Tipo de Arena</li>
    <li>Característica de la arena</li>
    <li>Instalado: Mecanismo Usado</li>
    <li>Instalado: Ancho de la ranura (in)</li>
    <li>Instalado: Tamaño de grano promedio de grava (in)</li>
    <li>Instalado: Tamaño Grava US. Mesh</li>
    <li>Recomendado: Mecanismo Recomendado</li>
    <li>Recomendado: Ancho de la ranura (in)</li>
    <li>Recomendado: Tamaño de grano promedio de grava (in)</li>
    <li>Recomendado: Tamaño Grava US. Mesh</li>
    <li>Alternativa a partir de Instalados: Mecanismo Alternativo</li>
    <li>Alternativa a partir de Instalados: Ancho de la ranura (in)</li>
    <li>Alternativa a partir de Instalados: Tamaño de grano promedio de grava (in)</li>
    <li>Alternativa a partir de Instalados: Tamaño Grava US. Mesh</li>
</ol>
<p>La fila de encabezados no se copia en el área de texto, pero las columnas deben estar en el orden especificado</p>
<form id="the-form" action="/arenas/campos_add_data_submit" method="post" accept-charset="utf-8">
    <textarea name="raw-data"></textarea>
    <input type="submit" name="submit" value="Cargar">
    {{ csrf_field() }}
</form>

@endsection