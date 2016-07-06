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
    <h1>Herramienta de selección de mecanismos de control de arena a partir de datos granulométricos</h1>
</div>

@include('partial.messages')

<p>Esta herramienta permite seleccionar y diseñar mecanismos de control de arena para un pozo específico a partir de los datos de una muestra granulométrica. La herramienta permite calcular los valores de interes como el coeficiente de uniformidad y tamaño de grano promedio y usarlos para la configuración de los mecanismos de control de arena, así como sugerir alternativas de diseño basadas en los postulados de exponentes en el área.</p>
<p>La herramienta es una alternativa complementaria que se enfoca en valores específicos de una muestra real proporcionando mayor confiabilidad en los mecanimos y su configuración, respecto a la matriz de selección que lo hace de forma generalizada.</p>
<p>A continuación seleccione la muestra de interés para llevar a cabo la selección del mecanismo mediante la herramienta. Aquí tambien la podrá editar o eliminar utilizando los botones de la parte derecha de la pantalla.</p>
<p>Si desea incluir una muestra nueva mediante una hoja de cálculo presione el botón importar datos para seleccionar el archivo desde su computadora, de lo contrario seleccione ingresar muestra.</p>
<p>Según la clasificación de Wenworth el tamaño de los granos de arena oscila entre 62 micras y 2000 micras.</p>
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
        Importar datos
    </a>
    <a href="{{ url('arenas/matrix_new') }}" class="btn btn-primary">
        Ingresar muestra
    </a>
</div>
@endsection