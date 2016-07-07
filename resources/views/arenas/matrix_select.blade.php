@extends('layouts.container')

@section('title', 'Control de Arena')

@section('head')

<style type="text/css" media="screen">
    

</style>

@endsection

@section('content')

<header>
    <h1>Herramienta de selección de mecanismos de control de arena a partir de datos granulométricos</h1>
</header>

@include('partial.messages')

<p>Esta herramienta permite seleccionar y diseñar mecanismos de control de arena para un pozo específico a partir de los datos de una muestra granulométrica. La herramienta permite calcular los valores de interes como el coeficiente de uniformidad y tamaño de grano promedio y usarlos para la configuración de los mecanismos de control de arena, así como sugerir alternativas de diseño basadas en los postulados de exponentes en el área.</p>
<p>La herramienta es una alternativa complementaria que se enfoca en valores específicos de una muestra real proporcionando mayor confiabilidad en los mecanimos y su configuración, respecto a la matriz de selección que lo hace de forma generalizada.</p>
<p>A continuación seleccione la muestra de interés para llevar a cabo la selección del mecanismo mediante la herramienta. Aquí tambien la podrá editar o eliminar utilizando los botones de la parte derecha de la pantalla.</p>
<p>Si desea incluir una muestra nueva mediante una hoja de cálculo presione el botón importar datos para seleccionar el archivo desde su computadora, de lo contrario seleccione ingresar muestra.</p>
<p>Según la clasificación de Wenworth el tamaño de los granos de arena oscila entre 62 micras y 2000 micras.</p>
<div class="multi-list-group">
    @foreach ($tablas as $tabla)
    <div class="item-container">
        <div class="item">
            <a href="/arenas/matrix/{{ $tabla->id }}">
                {{ $tabla->name }}
            </a>
            <a class="icon" href="/arenas/matrix/{{ $tabla->id }}/edit">
                <span class="glyphicon glyphicon-pencil"></span>Editar
            </a>
            <form action="/arenas/matrix/{{ $tabla->id }}" method="POST">
                {{ method_field('DELETE') }}
                {{ csrf_field() }}
                <button type="submit" class="icon minus-button">
                    <span class="glyphicon glyphicon-minus"></span>Eliminar
                </button>
            </form>
        </div>
    </div>
    @endforeach
</div>
<div class="buttons">
    <a href="/arenas/table_upload/arenas_muestras">
        Importar datos
    </a>
    <a href="/arenas/matrix_new">
        Ingresar muestra
    </a>
</div>
@endsection