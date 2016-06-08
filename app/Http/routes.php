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
Route::get('/fluidos/map/pozos', 'fluidosController@mapPozos');

// map
Route::get('/arenas/map', 'ArenasController@mapPozos');
Route::get('/arenas/map/{id}', 'ArenasController@mapDetail');
Route::get('/arenas/map/{id}/edit', 'ArenasController@mapEdit');
Route::put('/arenas/map/{id}', 'ArenasController@mapUpdate');
// matrix
Route::get('/arenas/matrix','ArenasController@matrixSelect');
Route::get('/arenas/matrix/{id}', 'ArenasController@matrixResults');
// fields
Route::get('/arenas/campos', 'ArenasController@listCampos');
Route::get('/arenas/campos/{id}', 'ArenasController@campoDetail');

Route::get('/{project}/table_upload/{table_name}', 'uploadController@form');
Route::post('/{project}/table_upload/{table_name}', 'uploadController@match');
Route::put('/{project}/table_upload/{table_name}', 'uploadController@put');

// Autentication
Route::get('auth/logout', 'Auth\AuthController@getLogout');
