@extends ('layouts.container')

@section ('content')

<header>
    <h1>Cuencas
        <small>Conectividad</small>
    </h1>
</header>

<main>
    <div class="list-group">
        @foreach ($basins as $basin)
            <a href="/conectividad/basins/{{ $basin->id }}">{{ $basin->name }}</a>
        @endforeach
    </div>
</main>

@endsection
