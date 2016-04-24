<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('home');
});

Route::get('/sla/map', 'slaController@mapPozos');

Route::get('/fluidos/map/campos', 'fluidosController@mapCampos');
Route::get('/fluidos/map/campos/{id}', 'fluidosController@campoDetail');

Route::get('/arenas/matrix','arenasController@matrixSelect');
Route::get('/arenas/matrix/{id}', 'arenasController@matrixResults');
Route::get('/arenas/map', 'arenasController@mapPozos');
