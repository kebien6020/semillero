@extends('layouts.container')

@section('title', 'Cargar tabla - ' . $project->display_name)

@section('content')

<header>
    <h1>Carga de Tabla de Datos <small>{{ $project->display_name }}</small></h1>
</header>

@include('partial.messages')

<p>
    Por favor cargue una tabla de excel con las siguientes caracteristicas:
</p>
<ul>
    <li>No debe contener celdas combinadas</li>
    <li>En la primera fila se ubican los nombres de las columnas</li>
    <li>Los datos deben estar en la primer hoja</li>
</ul>
<p>
    Las columnas que debe llevar son las siguientes:
</p>
<ul>
    @foreach($columns as $column)
    <li>{{ $column['display_name'] }}</li>
    @endforeach
</ul>

<form action="/{{ $project->name }}/table_upload/{{ $table_name }}"
    method="POST"
    enctype="multipart/form-data">
    {{ csrf_field() }}
    <div class="form-group">
        <label for="the_file">Archivo de Excel: </label>
        <input type="file" name="the_file">
    </div>
    <div class="submit-container">
        <input type="submit" name="submit" value="Cargar Tabla">
    </div>
</form>

@endsection
