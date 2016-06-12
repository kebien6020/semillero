@extends('layouts.container')

@section('title', 'Control de Arena')

@section('head')

<style type="text/css" media="screen">
    .list-group .list-group-item {
        padding: 0;
        border: 0;
    }
    .list-group .btn-group {
        width: 100%;
        height: 100%;
    }
    .list-group a {
        width: calc(100% - 100px - 100px);
        height: 100%;
        text-align: left;
    }
    .list-group .icon {
        width: 100px;
        text-align: center;
    }
    .list-group .btn {
        border-radius: 0;
    }
    .list-group .list-group-item:first-child .btn:first-child {
        border-top-left-radius: 4px;
    }
    .list-group .list-group-item:first-child .btn:last-child {
        border-top-right-radius: 4px;
    }
    .list-group .list-group-item:last-child .btn:first-child {
        border-bottom-left-radius: 4px;
    }
    .list-group .list-group-item:last-child .btn:last-child {
        border-bottom-right-radius: 4px;
    }
    .minus-button, .minus-button:hover, .minus-button:focus {
        color: darkred;
    }

</style>

@endsection

@section('content')

<div class="page-header">
    <h1>Selección de mecanismos de control de arena con base en un análisis de granulometría</h1>
</div>

@if (session()->has('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif

@if (session()->has('success'))
    <div class="alert alert-success">{!! session('success') !!}</div>
@endif

<p>A continuación puede seleccionar entre las muestras que han sido ingresadas en el aplicativo: </p>
<div class="list-group">
    @foreach ($tablas as $tabla)
    <div class="list-group-item">
        <div class="btn-group">
            <a class="btn btn-default" href="{{ url('arenas/matrix/' . $tabla->id) }}">
                {{ $tabla->name }}
            </a>
            <a class="btn btn-default icon" href="{{ url('arenas/matrix/' . $tabla->id) . '/edit' }}">
                <span class="glyphicon glyphicon-pencil"></span>Editar
            </a>
            <form action="{{ url('arenas/matrix/' . $tabla->id) }}" method="POST">
                {{ method_field('DELETE') }}
                {{ csrf_field() }}
                <button type="submit" class="btn btn-default icon minus-button">
                    <span class="glyphicon glyphicon-minus"></span>Eliminar
                </button>
            </form>
        </div>
    </div>
    @endforeach
</div>
<div class="buttons">
    <a href="{{ url('arenas/table_upload/arenas_muestras') }}" class="btn btn-primary">
        Cargar datos
    </a>
    <a href="{{ url('arenas/matrix_new') }}" class="btn btn-primary">
        Agregar muestra
    </a>
</div>
@endsection