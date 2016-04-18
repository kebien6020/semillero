@extends('layouts.master')

@section('title', 'Selección de Control de Arenas')

@section('content')

<h2>Matriz de selección de control de arenas</h2>
<table>
    <thead>
        <tr>
            <th>Tamaño de grano (Xi) [Micras]</th>
            <th>Frecuencia (fi)</th>
        </tr>
    </thead>
    <tbody>
        @foreach($samples as $sample)
            <tr db-id={{ $sample->id }} >
                <td>{{ $sample->grain_size }}</td>
                <td>{{ $sample->frecuency }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

@endsection