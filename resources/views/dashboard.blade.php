@extends('layouts.container')

@section('content')

<?php
    use Illuminate\Support\HtmlString;

    function makeDeleteButton($url, $text)
    {
        $html = "<form action=\"$url\" method=\"POST\">"
                . method_field('DELETE')
                . csrf_field()
                . "<button type=\"submit\" class=\"delete-button\">$text</button>"
                . "</form>";
        // Mark as safe
        return new HtmlString($html);
    }

?>

@include ('partial.messages')

<div class="panel panel-primary">
    <div class="panel-heading">Administrar Base de Datos</div>

    <div class="panel-body">
        <p>
            {{ makeDeleteButton(
                '/admin/delete_sla',
                'Eliminar: Sistemas de Levantamiento Artificial - Datos por pozos'
               ) }}
        </p>
        <p>
            {{ makeDeleteButton(
                '/admin/delete_arenas_pozos',
                'Eliminar: Mecanismos de Control de Arenas - Datos por pozos'
               ) }}
        </p>
        <p>
            {{ makeDeleteButton(
                '/admin/delete_arenas_campos',
                'Eliminar: Mecanismos de Control de Arenas - Datos por campos'
               ) }}
        </p>
        <p>
            {{ makeDeleteButton(
                '/admin/delete_fluidos_pozos',
                'Eliminar: Fluidos de Completamiento - Datos por pozos'
               ) }}
        </p>
        <p>
            {{ makeDeleteButton(
                '/admin/delete_fluidos_rangos',
                'Eliminar: Fluidos de Completamiento - Rangos de densidades'
               ) }}
        </p>
        <p>
            {{ makeDeleteButton(
                '/admin/delete_conectividad_pozos',
                'Eliminar: Conectividad - Datos por pozos'
               ) }}
        </p>
    </div>
</div>

@endsection