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

// fluidos
Route::get('/fluidos/map/campos', 'fluidosController@mapCampos');
Route::get('/fluidos/map/campos/{id}', 'fluidosController@campoDetail');
Route::get('/fluidos/map/pozos', 'fluidosController@mapPozos');
Route::get('/api/fluidos/density_dist/{field_id}/{fluid_id}', 'fluidosController@densityDist');

// map
Route::get('/arenas/map', 'ArenasController@mapPozos');
Route::get('/arenas/map/{id}', 'ArenasController@mapDetail');
Route::get('/arenas/map/{id}/edit', 'ArenasController@mapEdit');
Route::put('/arenas/map/{id}', 'ArenasController@mapUpdate');
// matrix
Route::get('/arenas/matrix','ArenasController@matrixSelect');
Route::get('/arenas/matrix/{id}', 'ArenasController@matrixResults');
Route::get('/arenas/matrix_new', 'ArenasController@matrixNew');
Route::post('/arenas/matrix', 'ArenasController@matrixCreate');
Route::get('/arenas/matrix/{id}/edit', 'ArenasController@matrixEdit');
Route::put('/arenas/matrix/{id}', 'ArenasController@matrixUpdate');
Route::delete('/arenas/matrix/{id}', 'ArenasController@matrixDelete');
// fields
Route::get('/arenas/campos', 'ArenasController@camposSelect');
Route::get('/arenas/campos/{id}', 'ArenasController@camposDetail');

Route::get('/{project}/table_upload/{table_name}', 'UploadController@form');
Route::post('/{project}/table_upload/{table_name}', 'UploadController@match');
Route::put('/{project}/table_upload/{table_name}', 'UploadController@put');

// Autentication
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// Test
Route::get('/test', function(){
    dd(Auth::user());
    return view('test');
});
