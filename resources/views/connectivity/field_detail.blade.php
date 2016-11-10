@extends ('layouts.container')

@section ('content')

<?php

function calcPercent($method, $count)
{
    return number_format($method->occurrences / $count * 100, 2) . '%';
}
?>

<header>
    <h1>Detalles del campo: {{ $field->name }}</h1>
</header>

<main>
    <p>
        Total de ocurrencias: {{ $occurrenceCount }}
        <ul class="list-group">
            @foreach ($distribution as $method)
                <li>
                    <span style="color: {{ $method->color }};">&#9679;</span>
                    {{ $method->name }}: {{ $method->occurrences }} ocurrencias
                    ({{ calcPercent($method, $occurrenceCount) }})
                </li>
            @endforeach
        </ul>
    </p>
</main>

@endsection
