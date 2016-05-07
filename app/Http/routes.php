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

use Illuminate\Http\Request;

Route::get('/', function () {
    return view('home');
});

Route::get('/sla/map', 'slaController@mapPozos');
Route::get('/sla/test/map', 'slaController@testMap');
Route::post('/sla/test/map/add_data_submit', 'slaController@testMapAddDataSubmit');

Route::get('/fluidos/map/campos', 'fluidosController@mapCampos');
Route::get('/fluidos/map/campos/{id}', 'fluidosController@campoDetail');

Route::get('/arenas/matrix','arenasController@matrixSelect');
Route::get('/arenas/matrix/{id}', 'arenasController@matrixResults');
Route::get('/arenas/map', 'arenasController@mapPozos');
Route::get('/arenas/map/{id}', 'arenasController@mapDetail');
Route::get('/arenas/map_add_data', 'arenasController@mapAddData');
Route::post('/arenas/map_add_data_submit', 'arenasController@mapAddDataSubmit');
Route::get('/arenas/campos', 'arenasController@listCampos');
Route::get('/arenas/campos/{id}', 'arenasController@viewCampo');
Route::get('/arenas/campos_add_data', 'arenasController@camposAddData');
Route::post('/arenas/campos_add_data_submit','arenasController@camposAddDataSubmit');

Route::get('/{project}/table_upload/{table_name}', 'uploadController@form');
Route::post('/{project}/table_upload/{table_name}', 'uploadController@match');
Route::put('/{project}/table_upload/{table_name}', 'uploadController@put');

// Autentication
Route::get('auth/logout', 'Auth\AuthController@getLogout');
