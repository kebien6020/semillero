@extends('layouts.container')

@section('title', 'Control de Arenas por Campos')

@section('content')

<header>
    <h1>Matriz de selección preliminar de mecanismos de control de arena en los campos operados por Ecopetrol S.A.</h1>
</header>

@include('partial.messages')

<p>A continuación se presenta un listado de campos organizado por cuencas sedimentarias de Colombia identificados con mecanismos de control de arena.</p>

<p>Seleccionar un campo para conocer las variables granulométricas de interés, el mecanismo de control de arena instalado y el mecanismo de control de arena recomendado a partir de dichas variables.</p>
<ol class="list-group">
    @foreach ($basins as $basin)
    <li>
        {{ $basin->name }}
        <div class="list-group">
            @foreach ($basin->fields->sortBy('name')->values() as $field)
                <a href="/arenas/campos/{{ $field->id }}">{{ $field->name }}</a>
            @endforeach
        </div>
    </li>
    @endforeach
</ol>

<div class="buttons">
    <a href="/arenas/table_upload/arenas_campos">
        Importar datos
    </a>
</div>

@endsection