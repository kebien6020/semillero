@extends ('layouts.container')

@section ('title', 'SLA - Configurar criterio')

@section ('script', 'als_matrix_criterion_form')

@section ('content')

<?php
    $edit = isset($criterion)
?>

<header>
    <h1>
        @if ($edit)
            Configurar funciones valor del criterio: {{ $criterion->name }}
        @else
            Agregar nuevo criterio
        @endif
    </h1>
</header>

<main>
    <p>
        @if($edit)
            Aquí podrá configurar el criterio {{ $criterion->name }} y sus funciones valor.
        @else
            Aquí podrá agregar un nuevo criterio a la matriz de selección preliminar.
        @endif
    </p>
    <form
        class="form-2-10"
        action="/sla/matrix/criteria{{ $edit ? '/' . $criterion->id : ''}}"
        method="post"
    >
        @if($edit) {{ method_field('PUT') }} @endif
        {{ csrf_field() }}
        <div class="form-group">
            <label for="input-name">Nombre</label>
            <input type="text" id="input-name" name="name" placeholder="Nombre"
            @if ($edit)
                value="{{ $criterion->name }}"
            @endif
            >
        </div>
        <div class="form-group">
            <label for="input-weight">Peso</label>
            <input type="text" id="input-weight" name="weight" placeholder="Peso"
            @if ($edit)
                value="{{ $criterion->weight }}"
            @endif
            >
        </div>
        <div id="value-functions-initial-data" style="display: none;">
            @if ($edit)
                {
                    "alternatives": {{ $alternatives->toJson() }},
                    "valueFunctions": {{ $valueFunctions->toJson() }},
                    "type": "{{ $criterion->type }}"
                }
            @else
                {
                    "alternatives": {{  $alternatives->toJson()  }}
                }
            @endif
        </div>
        <div id="value-function-editor">Cargando editor de funciones valor...</div>
        <div class="submit-container">
            <input type="submit" value="@if($edit) Actualizar @else Agregar @endif criterio">
        </div>
    </form>
</main>

@endsection
