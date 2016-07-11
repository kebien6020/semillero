@extends('layouts.container')

@section('title', 'Selección de Control de Arena')

@section('view-class', 'arenas-matrix-edit')

@section('script', 'arenas_matrix_edit')

@section('content')

<header>
    @if ($edit)
    <h1>Sección de edición de los datos ingresados</h1>
    @else
    <h1>Ingreso de datos granulométricos para una muestra de pozo</h1>
    @endif
</header>

@include('partial.messages')

@if ($edit)

<p>Para llevar a cabo una modificación de los datos utilice esta sección. Si requiere adicionar otro dato. Presione el botón adicionar fila en la parte inferior, y si lo requiere eliminar presione eliminar fila.</p>
<p>Una vez completada la modificación, presione el botón "Actualizar Datos"</p>
<div class="note">
    <header>
        <h3>Nota</h3>
    </header>
    <main>
        Se recomienda hacer una copia de la información antes de ser modificada ya que los cambios sobreescribiran a los datos existentes y no se podrán recuperar.
    </main>
</div>

@else

<p>Ingrese los datos de tamaño de grano y peso de muestra para la muestra analizada en laboratorio.</p>
<p>Recuerde dar un nombre a la tabla para su posterior identificacion en la herramienta.</p>
<p>Si requiere utilizar mas filas o eliminar alguna de ellas utilice los botones al inferior de la página.</p>
<p>Una vez cargados los datos, presione el botón "Agregar Datos"</p>

@endif

<form id="the_form"
    action="/arenas/matrix/{{ $edit ? $sample_group->id : '' }}"
    data-edit="{{ $edit ? 'true' : 'false' }}"
    @if ($edit)
        data-sample-group-id="{{ $sample_group->id }}"
    @endif
    method="POST">
    {{ $edit ? method_field('PUT') : '' }}
    {{ csrf_field() }}
    <div class="title">
        <label for="name">Nombre de la Tabla</label>
        <input type="text" name="name" required>
    </div>
    <table>
        <thead>
            <tr>
                <th>Tamaño de grano [Micras]</th>
                <th>Peso de muestra [gr]</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type="text" name="grain-size-1"></td>
                <td><input type="text" name="frequency-1"></td>
            </tr>
            <tr class="button-row">
                <td colspan="2">
                    <div>
                        <button type="button" class="plus-button">
                            <span class="glyphicon glyphicon-plus"></span>Adicionar Fila
                        </button>
                        <button type="button" class="minus-button">
                            <span class="glyphicon glyphicon-minus"></span>Eliminar Fila
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="submit-container">
        <input type="submit" name="submit" value="{{ $edit ? 'Actualizar' : 'Agregar' }} Datos">
    </div>
</form>

@endsection