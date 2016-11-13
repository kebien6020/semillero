@extends ('layouts.container')

@section ('title', 'SLA - Configurar Alternativa')

@section ('content')

<?php
    $edit = isset($alternative)
?>

<header>
    @if ($edit)
        <h1>Editar alternativa: {{ $alternative->name }}</h1>
    @else
        <h1>Agregar nueva alternativa</h1>
    @endif
</header>

<main>
    <form
        class="form-3-9"
        action="/sla/matrix/alternatives{{ $edit ? '/' . $alternative->id : ''}}"
        method="post">
        @if($edit) {{ method_field('PUT') }} @endif
        {{ csrf_field() }}
        <div class="form-group">
            <label for="input-name">Nombre de la alternativa</label>
            <input
                type="text"
                name="name"
                @if($edit)
                    value="{{$alternative->name}}"
                @endif
                placeholder="Nombre de la alternativa"
                required
            >
        </div>
        <div class="submit-container">
            <input
                type="submit"
                @if($edit)
                    value="Actualizar alternativa"
                @else
                    value="Agregar alternativa"
                @endif
            >
        </div>
    </form>
</main>

@endsection
