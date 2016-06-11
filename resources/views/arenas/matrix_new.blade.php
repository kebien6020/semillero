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
        width: 90%;
    }
    .minus-button, .minus-button:hover, .minus-button:focus {
        color: darkred;
    }
    #the_form .container-fluid {
        margin-bottom: 0.5em;
    }
</style>

<script type="text/javascript">
    // Start with a row harcoded in the html
    var currentRow = 1;

    $(document).ready(function(){
        $('.plus-button').click(function(){
            let $tr = $('<tr></tr>');
            let $td_left = $('<td></td>');
            let $td_right = $('<td></td>');
            let $input_size = 
                $('[name="grain-size-' + currentRow + '"]').clone();
            let $input_frequency = 
                $('[name="frequency-' + currentRow + '"]').clone();

            ++currentRow;
            $input_size.attr('name', 'grain-size-' + currentRow);
            $input_frequency.attr('name', 'frequency-' + currentRow);

            $td_left.append($input_size);
            $td_right.append($input_frequency);
            $tr.append($td_left).append($td_right);
            
            let $last_tr = $('#the_form tbody > tr:last-child');
            $last_tr.before($tr);
        });
        $('.minus-button').click(function(){
            $prev_last_tr = $('#the_form tbody > tr:last-child');

            do {
                $prev_last_tr = $prev_last_tr.prev();
            } while ($prev_last_tr.is(':hidden'))

            $prev_last_tr.find('input').val('');
            $prev_last_tr.hide();

        });
    });
</script>

@endsection

@section('content')

@if (session()->has('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
@endif

<form action="{{ url('arenas/matrix') }}" method="POST" id="the_form" class="form-horizontal">
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
                            <span class="glyphicon glyphicon-plus">
                        </button>
                        <button type="button" class="btn btn-default minus-button">
                            <span class="glyphicon glyphicon-minus">
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="form-group text-center">
        <input type="submit" name="submit" value="Agregar Muestra" class="btn btn-success">
    </div>
</form>

@endsection