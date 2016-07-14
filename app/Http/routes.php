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

Route::get('/', 'HomeController@home');

Route::get('/sla/map', 'slaController@mapPozos');
Route::get('/sla/test/map', 'slaController@testMap');
Route::post('/sla/test/map/add_data_submit', 'slaController@testMapAddDataSubmit');

// fluidos
// maps
Route::get('/fluidos/map/campos', 'fluidosController@mapCampos');
Route::get('/fluidos/map/campos/{id}', 'fluidosController@campoDetail');
Route::get('/fluidos/map/pozos', 'fluidosController@mapPozos');

Route::get('/api/fluidos/density_dist/{field_id}/{fluid_id}', 'fluidosController@densityDist');
Route::get('/api/fluidos/fluid_occurrences', 'fluidosController@fluidOccurrences');
Route::get('/api/fluidos/fluids', 'fluidosController@fluids');
Route::get('/api/fluidos/fields', 'fluidosController@fields');
Route::get('/api/fluidos/field_info/{id}', 'fluidosController@fieldInfo');

//matrix
Route::get('/fluidos/matrix', 'fluidosController@matrix');

// Arenas

// map
Route::get('/arenas/map', 'ArenasController@mapPozos');
Route::get('/arenas/map/{id}', 'ArenasController@mapDetail');
Route::get('/arenas/map/{id}/edit', 'ArenasController@mapEdit');
Route::put('/arenas/map/{id}', 'ArenasController@mapUpdate');

Route::get('/api/arenas/sand_controls', 'ArenasController@sandControls');
Route::get('/api/arenas/sand_control_groups', 'ArenasController@sandControlGroups');
// matrix
Route::get('/arenas/matrix','ArenasController@matrixSelect');
Route::get('/arenas/matrix/{id}', 'ArenasController@matrixResults');
Route::get('/arenas/matrix_new', 'ArenasController@matrixNew');
Route::post('/arenas/matrix', 'ArenasController@matrixCreate');
Route::get('/arenas/matrix/{id}/edit', 'ArenasController@matrixEdit');
Route::put('/arenas/matrix/{id}', 'ArenasController@matrixUpdate');
Route::delete('/arenas/matrix/{id}', 'ArenasController@matrixDelete');

Route::get('/api/arenas/get_matrix_plot/{id}', 'ArenasController@getMatrixPlot');
Route::get('/api/arenas/sample_group/{id}', 'ArenasController@sampleGroup');
// fields
Route::get('/arenas/campos', 'ArenasController@camposSelect');
Route::get('/arenas/campos/{id}', 'ArenasController@camposDetail');

Route::get('/{project}/table_upload/{table_name}', 'UploadController@form');
Route::post('/{project}/table_upload/{table_name}', 'UploadController@match');
Route::put('/{project}/table_upload/{table_name}', 'UploadController@put');

// Test
Route::get('/test', function(){
    dd(Auth::user());
    return view('test');
});

Route::auth();

Route::get('/profile', 'HomeController@profile');
