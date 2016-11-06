@extends ('layouts.container')

@section ('content')

<header>
    @if (isset($name))
        <h1>Editar alternativa: BM</h1>
    @else
        <h1>Agregar nueva alternativa</h1>
    @endif
</header>

<main>
    <form class="form-3-9" action="" method="post">
        <div class="form-group">
            <label for="input-name">Nombre de la alternativa</label>
            <input
                type="text"
                name="name"
                @if(isset($name))
                    value="{{$name}}"
                @endif
                placeholder="Nombre de la alternativa"
                required
            >
        </div>
        <div class="submit-container">
            <input
                type="submit"
                @if(isset($name))
                    value="Actualizar alternativa"
                @else
                    value="Agregar alternativa"
                @endif
            >
        </div>
    </form>
</main>

@endsection
