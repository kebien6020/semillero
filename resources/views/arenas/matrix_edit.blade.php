@extends('layouts.container')

@section('title', 'Selección de Control de Arena')

@section('head')

<style type="text/css" media="screen">

    #the_form .btn-group {
        width: 50%;
        margin-left: auto;
        margin-right: auto;
    }
    .plus-button {
        width: 50%;
    }
    .minus-button, .minus-button:hover, .minus-button:focus {
        color: darkred;
        width: 50%;
    }
    #the_form .container-fluid {
        margin-bottom: 0.5em;
    }
</style>

<script type="text/javascript">

    'use strict';

    // Start with a row harcoded in the html
    var currentRow = 1;

    function addRow(grain_size, frequency) {
        if (grain_size == undefined) grain_size = "";
        if (frequency == undefined) frequency = "";
        let $tr = $('<tr></tr>');
        let $td_left = $('<td></td>');
        let $td_right = $('<td></td>');
        let $input_size = 
            $('[name="grain-size-' + currentRow + '"]').clone();
        let $input_frequency = 
            $('[name="frequency-' + currentRow + '"]').clone();

        ++currentRow;
        $input_size
            .attr('name', 'grain-size-' + currentRow)
            .val(grain_size);
        $input_frequency
            .attr('name', 'frequency-' + currentRow)
            .val(frequency);

        $td_left.append($input_size);
        $td_right.append($input_frequency);
        $tr.append($td_left).append($td_right);
        
        let $last_tr = $('#the_form tbody > tr:last-child');
        $last_tr.before($tr);
    }
    function hideRow() {
        let $prev_last_tr = $('#the_form tbody > tr:last-child');

        do {
            $prev_last_tr = $prev_last_tr.prev();
        } while ($prev_last_tr.is(':hidden'))

        $prev_last_tr.find('input').val('');
        $prev_last_tr.hide();
    }

    $(document).ready(function() {
        @if ($edit)
            $('#the_form input[name="name"]').val('{{ $sample_group->name }}');
            hideRow();
            @foreach ($samples as $sample)
                addRow('{{ $sample->grain_size }}', '{{ $sample->frequency }}');
            @endforeach
        @else
            for (let i = 0; i < 10; ++i) addRow();
        @endif
        $('.plus-button').click(function(){
            addRow();
        });
        $('.minus-button').click(function(){
            hideRow();
        });
    });
</script>

@endsection

@section('content')

<div class="page-header">
    @if ($edit)
    <h1>Sección de edición de los datos ingresados</h1>
    @else
    <h1>Ingreso de datos granulométricos para una muestra de pozo</h1>
    @endif
</div>

@include('partial.messages')

@if ($edit)
<p>Para llevar a cabo una modificación de los datos utilice esta sección. Si requiere adicionar otro dato. Presione el botón adicionar fila en la parte inferior, y si lo requiere eliminar presione eliminar fila.</p>
<p>Una vez completada la modificación, presione el botón "Actualizar Datos"</p>
<div class="panel panel-info">
    <div class="panel-heading">
        <h3 class="panel-title">Nota</h3>
    </div>
    <div class="panel-body">
        Se recomienda hacer una copia de la información antes de ser modificada ya que los cambios sobreescribiran a los datos existentes y no se podrán recuperar.
    </div>
</div>
@else
<p>Ingrese los datos de tamaño de grano y peso de muestra para la muestra analizada en laboratorio.</p>
<p>Recuerde dar un nombre a la tabla para su posterior identificacion en la herramienta.</p>
<p>Si requiere utilizar mas filas o eliminar alguna de ellas utilice los botones al inferior de la página.</p>
<p>Una vez cargados los datos, presione el botón "Agregar Datos"</p>
@endif

<form action=
    @if ($edit)
        "{{ url('arenas/matrix/' . $sample_group->id) }}"
    @else 
        "{{ url('arenas/matrix') }}"
    @endif
    method="POST" id="the_form" class="form-horizontal">
    @if ($edit)
        {{ method_field('PUT') }}
    @endif
    {{ csrf_field() }}
    <div class="container-fluid">
        <label for="name" class="col-xs-2">Nombre de la Tabla</label>
        <input type="text" class="col-xs-10" name="name" required>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>Tamaño de grano [Micras]</th>
                <th>Peso de muestra [gr]</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type="text" name="grain-size-1" class="form-group-item text-center"></td>
                <td><input type="text" name="frequency-1" class="form-group-item text-center"></td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="btn-group">
                        <button type="button" class="btn btn-default plus-button">
                            <span class="glyphicon glyphicon-plus"></span>Adicionar Fila
                        </button>
                        <button type="button" class="btn btn-default minus-button">
                            <span class="glyphicon glyphicon-minus"></span>Eliminar Fila
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="form-group text-center">
        <input type="submit" name="submit" value="@if($edit) Actualizar @else Agregar @endif Datos" class="btn btn-success">
    </div>
</form>

@endsection