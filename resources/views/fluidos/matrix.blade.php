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

<p>Explicación de la matriz de selección.</p>

<section ng-app="matrixApp">
    
    <form action="#" class="form-2-10">
        <section ng-controller="DensityController">
            <h2>Calculo de Densidad</h2>
            <div class="form-group">
                <label for="tvd">TVD: </label>
                <input id="tvd" type="text" ng-model="tvd">
            </div>
            <div class="form-group">
                <label for="bhp">BHP: </label>
                <input id="bhp" type="text" ng-model="bhp">
            </div>
            <div class="form-group">
                <label for="bht">BHT: </label>
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
            <div class="conditions">
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
                        En caso de presentarse Kaolinita o Clorita referirse a ...
                    </main>
                </div>
            </div>
            <div class="recommendations">
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