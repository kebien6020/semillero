@extends('layouts.master')

@section('title', 'Mapa de Fluidos de Completamiento')

@section('content')

@include('partial.messages')

<table>
    <thead>
        <tr>
            <th colspan="2">Fluidos usados en el campo {{ $campo }}</th>
        </tr>
        <tr>
            <th>Fluido</th>
            <th>Porcentaje</th>
        </tr>
    </thead>
    <tbody>
        @foreach($fluidos as $fluido)
            <tr>
                <td>{{ $fluido->name }}</td>
                <td>{{ sprintf('%.2f',($fluido->pivot->percentage)*100) . '%' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<div class="button-container">
    <a class="fancy-button-small" href="{{ url('fluidos/map/campos') }}">
        Volver
    </a>
</div>

@endsection