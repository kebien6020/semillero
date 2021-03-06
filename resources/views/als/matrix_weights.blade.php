@extends ('layouts.container')

@section ('title', 'SLA - Pesos')

@section ('content')

<header>
    <h1>Configurar Pesos</h1>
</header>

<main>
    <p>
        Aquí podrá configurar los pesos de cada uno de los criterios de selección.
    </p>
    <form class="form-2-10" action="/sla/matrix/weights" method="post">
        {{ method_field('PUT') }}
        {{ csrf_field() }}
        @foreach ($criteria as $criterion)
            <div class="form-group">
                <label for="input-weight-{{ $criterion->id }}">{{ $criterion->name }}</label>
                <input id="input-weight-{{ $criterion->id }}"
                    type="text"
                    name="weight-{{ $criterion->id }}"
                    placeholder="Peso para el parametro {{ $criterion->name }}"
                    autocomplete="off"
                    value="{{ $criterion->weight }}">
            </div>
        @endforeach

        <div class="submit-container">
            <input type="submit" value="Actualizar Pesos">
        </div>
    </form>
</main>

@endsection
