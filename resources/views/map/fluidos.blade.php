@extends('layouts.master')

@section('title', 'Mapa de Fluidos de Completamiento')

@section('content')

<p>Aquí va a ir mapa de fluidos de completamiento. Por ahora aqui estan los datos por campo:</p>

<script>
$(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});
</script>

<table>
    <thead>
        <tr>
            <th>Campo</th>
            <th>No. Pozos</th>
        </tr>
    </thead>
    <tbody>
        @foreach($campos as $campo)
            <tr class="clickable-row" data-href="/map/fluidos/{{ $campo->id }}">
                <td>{{ $campo->name }}</td>
                <td>{{ $campo->number_wells }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

@endsection