@extends ('layouts.container')

@section ('title', 'SLA - Matriz')

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
        @foreach ($criteria as $criterion)
            <div class="form-group">
                <label for="input-{{ $criterion->id }}">{{ $criterion->name }}</label>
                <input
                    id="input-{{ $criterion->id }}"
                    type="text"
                    name="{{ $criterion->id }}"
                    placeholder="{{ $criterion->name }}"
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
