@extends ('layouts.container')

@section ('content')

<header>
    <h1>Campos de la cuenca: {{ $basin->name }}</h1>
</header>

<main>
    <p>
        Seleccione un campo:
    </p>
    <div class="list-group">
        @foreach ($fields as $field)
            <a href="/conectividad/basins/{{ $basin->id }}/fields/{{ $field->id }}">
                {{ $field->name }}
            </a>
        @endforeach
    </div>
</main>

@endsection
