@extends ('layouts.container')

@section ('content')

<?php
    $edit = isset($param)
?>

<header>
    <h1>
        @if ($edit)
            Configurar parametro: {{ $param->name }}
        @else
            Agregar nuevo parámetro
        @endif
    </h1>
</header>

<main>
    <p>
        @if($edit)
            Aquí podrá configurar el parametro {{ $param->name }}.
        @else
            Aquí podrá agregar un nuevo parametro a la matriz de selección preliminar.
        @endif
    </p>
    <form class="form-2-10" action="/sla/matrix/param{{ $edit ? '/' . $param->id : ''}}">
        <div class="form-group">
            <label for="input-name">Nombre</label>
            <input type="text" id="input-name" name="name" placeholder="Nombre"
            @if ($edit)
                value="{{ $param->name }}"
            @endif
            >
        </div>
        <div class="value-function-editor">Cargando editor de funciones valor...</div>
        <div class="submit-container">
            <input type="submit" value="Agregar parametro">
        </div>
    </form>
</main>

@endsection