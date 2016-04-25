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
Route::get('/arenas/map/add_data', 'arenasController@mapAddData');
Route::get('/arenas/map/add_data_submit', 'arenasController@mapDoAddData');
Route::get('/arenas/campos', 'arenasController@listCampos');
Route::get('/arenas/campos/{id}', 'arenasController@viewCampo');
Route::get('/arenas/campos_add_data', 'arenasController@camposAddData');
Route::post('/arenas/campos_add_data_submit','arenasController@camposAddDataSubmit');

// Autentication
Route::get('auth/logout', 'Auth\AuthController@getLogout');
