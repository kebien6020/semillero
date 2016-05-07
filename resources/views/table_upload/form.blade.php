@extends('layouts.master')

@section('title', 'Cargar tabla - ' . $project->display_name)

@section('content')

<form action="/{{ $project->name }}/table_upload/{{ $table_name }}"
    method="post"
    enctype="multipart/form-data">
    {{ csrf_field() }}
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
        <li>{{  $column['display_name']  }}</li>
        @endforeach
    </ul>
    <input type="file" name="the_file">
    <input type="submit" name="submit" value="Cargar Tabla">
</form>

@endsection