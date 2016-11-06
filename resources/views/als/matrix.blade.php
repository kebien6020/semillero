@extends ('layouts.container')

@section ('content')

<header>
    <h1>Matriz de Seleccion <small>Sistemas de levantamiento artificial</small></h1>
</header>

@include ('partial.messages')

<main>
    <p>
        La matriz de seleccion preliminar de sistemas de levantamiento artificial permite realizar la selección de un sistema de levantamiento artificial a partir de datos suminisitrados.
    </p>
    {{-- TODO: Extract as React Component --}}
    <form class="form-3-9" action="" method="post">
        @foreach ($params as $param)
            <div class="form-group">
                <label for="input-{{ $param->id }}">{{ $param->name }}</label>
                <input
                    id="input-{{ $param->id }}"
                    type="text"
                    name="{{ $param->id }}"
                    placeholder="{{ $param->name }}"
                >
            </div>
        @endforeach
    </form>
    <div class="">
        <h2>Recomendaciones</h2>
        <ol>
            <li>BES</li>
            <li>BM</li>
            <li>BCP</li>
        </ol>
    </div>
    {{-- Extract until here --}}
    <div class="buttons">
        <a href="/sla/matrix/config">Configurar matriz</a>
    </div>
</main>

@endsection
