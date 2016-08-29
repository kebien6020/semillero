@extends('layouts.container')

@section('title', 'Fluidos - Martiz de Selección')

@section('view-class', 'fluidos-matrix')

@section('script', 'fluidos_matrix')

@section('content')

{{-- For a dynamic experience this page uses angularjs --}}
{{-- @{{expr}} is ignored by blade and compiled to {{expr}} (without the @) --}}

<header>
    <h1>Matriz de identificación de fluidos de completamiento</h1>
</header>

@include('partial.messages')

<p>
Esta herramienta permite identificar los fluidos de completamiento adecuados  para un pozo a partir de datos de presión de yacimiento, temperatura de yacimiento, TVD (True Vertical Depth),identificación de pozo de gas o pozo de petróleo, clasificación de agua de formación según la presencia de iones (Análisis Fisicoquímico) y la presencia de arcillas. Esta herramienta permite identificar los fluidos de completamiento que controlen el pozo mediante la densidad adecuada, que sean  compatibles con el agua de formación teniendo en cuenta la teoría del ion común y que controlen  las arcillas presentes en la formación basados en la teoría de intercambio catiónico.
</p>
<p>
A continuación se deben ingresar los datos necesarios para calcular la densidad requerida, y se debe seleccionar el tipo de agua de formación que presenta el pozo (predominancia en iones) y finalmente el tipo de arcilla presente, una vez seleccionados estos datos la herramienta recomendara unos fluidos de completamiento. Recordar que para evitar la formación de emulsiones se deben seguir las recomendaciones expuestas en el documento que soporta el desarrollo de esta herramienta.
</p>

<section ng-app="matrixApp">
    
    <form action="#" class="form-2-10">
        <section ng-controller="DensityController">
            <h2>Calculo de Densidad</h2>
            <div class="form-group">
                <label for="tvd">TVD (ft): </label>
                <input id="tvd" type="text" ng-model="tvd">
            </div>
            <div class="form-group">
                <label for="bhp">BHP (PSI): </label>
                <input id="bhp" type="text" ng-model="bhp">
            </div>
            <div class="form-group">
                <label for="bht">BHT (°F): </label>
                <input id="bht" type="text" ng-model="bht">
            </div>
            <div class="form-group">
                <label for="gas">Tipo de pozo: </label>
                <select id="gas" ng-model="gas">
                    <option value="0" selected>Productor de petróleo</option>
                    <option value="1">Productor de gas</option>
                </select>
            </div>
            <div class="result">
                <p>Densidad calculada: @{{ density() }}</p>
            </div>
        </section>
        <section class="cond" ng-controller="ConditionController">
            <div class="conditions" ng-show="showAll">
                <h2>Características del agua de formación</h2>
                <div class="form-group" ng-repeat="cond in conditions" ng-show="cond.show">
                    <div class="checkbox-container">
                        <label for="cond-@{{cond.name}}">
                            <input id="cond-@{{cond.name}}" type="checkbox" ng-model="cond.checked">
                            <span ng-bind-html="cond.display"></span>
                        </label>
                    </div>
                </div>
                <h2>Tipo de arcilla presente</h2>
                <div class="form-group" ng-show="showShales">
                    <div class="checkbox-container">
                        <label for="cond-ilita">
                            <input id="cond-ilita" type="checkbox" ng-model="ilita">
                            <span>Ilita</span>
                        </label>
                    </div>
                </div>
                <div class="form-group" ng-show="showShales">
                    <div class="checkbox-container">
                        <label for="cond-mont">
                            <input id="cond-mont" type="checkbox" ng-model="mont">
                            <span>Montmorrillonita</span>
                        </label>
                    </div>
                </div>
                <div class="note" ng-show="showShales">
                    <header>
                        Nota
                    </header>
                    <main>
                        En caso de presencia de Caolinita y Clorita se deben seguir las recomendaciones expuestas en el documento que soporta el desarrollo de esta herramienta para evitar incompatibilidades con este tipo de minerales de arcillas.
                    </main>
                </div>
            </div>
            <div class="recommendations" ng-show="showAll">
                <h2>Recomendaciones</h2>
                <ul>
                    <li ng-repeat="recommendation in recommendations" ng-bind-html="recommendation.display">
                    </li>
                </ul>
            </div>
        </section>
    </form>

</section>

@endsection