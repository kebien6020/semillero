@extends('layouts.master')

@section('title', 'Mapa Arenas Pozos - Insertar datos')

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

<form id="the-form" action="/arenas/map/add_data_submit" method="post" accept-charset="utf-8">
    <p>Los datos se ingresan en el formato 
    <textarea name="raw-data"></textarea>
    <input type="submit" name="submit" value="Cargar">
</form>

@endsection