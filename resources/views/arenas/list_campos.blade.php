@extends('layouts.container')

@section('title', 'Control de Arenas por Campos')

@section('content')

<div class="page-header">
    <h1>Matriz de selección preliminar de mecanismos de control de arena en los campos operados por Ecopetrol S.A.</h1>
</div>

@if (session()->has('success'))
    <div class="alert alert-success">{!! session('success') !!}</div>
@endif

<p>A continuación se presenta un listado de campos organizado por cuencas sedimentarias de Colombia, seleccione el que usted desee para conocer el mecanismo de control de arena recomendado con base en el coeficiente de uniformidad.</p>
<ol class="list-group">
    @foreach ($basins as $basin)
    <li class="list-group-item">
        {{ $basin->name }}
        <div class="list-group">
            @foreach ($basin->fields->sortBy('name')->values() as $field)
                <a class="list-group-item" href="{{ url('arenas/campos/' . $field->id) }}">{{ $field->name }}</a>
            @endforeach
        </div>
    </li>
    @endforeach
</ol>

<div class="buttons">
    <a href="{{ url('arenas/table_upload/arenas_campos') }}" class="btn btn-primary">
        Cargar datos
    </a>
</div>

@endsection