@extends ('layouts.container')

@section ('content')

<header>
    <h1>Configurar Pesos</h1>
</header>

<main>
    <p>
        Aquí podrá configurar los pesos de cada uno de los parametros.
    </p>
    <form class="form-2-10" action="" method="post">
        @foreach ($params as $param)
            <div class="form-group">
                <label for="input-weight-{{ $param->id }}">{{ $param->name }}</label>
                <input id="input-weight-{{ $param->id }}"
                    type="text"
                    name="weight-{{ $param->id }}"
                    placeholder="Peso para el parametro {{ $param->name }}"
                    autocomplete="off"
                    value="{{ $param->weight }}">
            </div>
        @endforeach

        <div class="submit-container">
            <input type="submit" value="Actualizar Pesos">
        </div>
    </form>
</main>

@endsection
