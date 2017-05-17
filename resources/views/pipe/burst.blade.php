@extends ('layouts.container')

@section ('title', 'Tuberias - Evaluador de Estallido y Colapso')

@section ('script', 'pipe_burst')

{{-- Share styles with pipe_matrix --}}
@section ('view-class', 'pipe-matrix')

@section ('content')

<header>
    <h1>Herramienta de evaluación de estallido y colapso</h1>
</header>

<main>
    <p style="text-align: justify;">A partir de la recomendaciónes de material generada a partir de la evaluación de la corrosividad del ambiente, esta herramienta permite estudiar las cargas de presión generadas durante condiciones críticas a fin de seleccionar el grado de acero cuyo rating satisfaga estos parámetros.</p>
    <div id="app">Cargando Matriz...</div>
</main>

@endsection
