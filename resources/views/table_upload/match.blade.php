@extends('layouts.container')

@section('title', 'Cargar tabla - ' . $project->display_name)

@section('content')

@include('partial.messages')

<p>Por favor seleccione para cada columna necesaria la columna
    del archivo que contiene la información requerida</p>
<form class="form-horizontal"
    action="{{ url($project->name . '/table_upload/' . $table_name) }}"
    method="post">
    {{ method_field('PUT') }}
    {{ csrf_field() }}
    @foreach ($columns as $i => $column)
        <div class="form-group">
            <label class="col-sm-3" for="{{ $column['name'] }}">{{  $column['display_name']  }}</label>
            <select class="col-sm-9" name="columns[{{ $column['name'] }}]" autocomplete="off">
                @foreach ($uploaded_columns->toArray() as $j => $ucolumn)

                <option value="{{ $ucolumn }}" 
                    @if ($i < count($uploaded_columns) and $j == $i)
                        selected
                    @endif
                >{{ $ucolumn }}</option>
                @endforeach
            </select>
        </div>
    @endforeach
    <div class="buttons">
        <input class="btn btn-success" type="submit" name="submit" value="Cargar">
    </div>
</form>

@endsection