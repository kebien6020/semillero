@extends('layouts.container')

@section('title', 'Cargar tabla - ' . $project->display_name)

@section('content')

@include('partial.messages')

<p>Por favor seleccione para cada columna necesaria la columna
    del archivo que contiene la información requerida</p>

<form class="form-3-9"
    action="/{{ $project->name }}/table_upload/{{ $table_name }}"
    method="POST">
    {{ method_field('PUT') }}
    {{ csrf_field() }}
    @foreach ($columns as $i => $column)
        <div class="form-group">
            <label for="{{ $column['name'] }}">{{  $column['display_name']  }}</label>
            <select name="columns[{{ $column['name'] }}]" autocomplete="off">
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
    <div class="submit-container">
        <input type="submit" name="submit" value="Cargar">
    </div>
</form>

@endsection
