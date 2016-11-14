@extends ('layouts.container')

@section ('content')

<?php

function calcPercent($method, $count)
{
    return number_format($method['count'] / $count * 100, 2) . '%';
}
?>

<header>
    <h1>Tendencias de conectividad del campo: {{ $field->name }}</h1>
</header>

<main>
    <p>
        Total de pozos: {{ $wellCount }}
    </p>
    <ul class="list-group">
        @foreach ($distribution as $method)
            <li>
                <span style="color: {{ $method['color'] }};">&#9679;</span>
                {{ $method['name'] }}: {{ $method['count'] }} pozos
                ({{ calcPercent($method, $wellCount) }})
            </li>
        @endforeach
    </ul>
    <h2>
        Pozos
    </h2>
    <ul class="list-group">
        @foreach($wells as $well)
            <li>
                <span style="color: {{ $well['color'] }};">&#9679;</span>
                {{ $well['name'] }}: {{ $well['method'] }}
            </li>
        @endforeach
    </ul>
</main>

@endsection
