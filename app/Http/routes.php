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

// Completamientos multiples

Route::group(['prefix' => 'multiples', 'middleware' => 'auth'], function () {

    Route::get('/map/pozos', 'MultipleController@mapPozos');

    // API routes
    Route::get('/api/wells', 'MultipleController@wells');
    Route::get('/api/completions', 'MultipleController@completions');
});

// Conectividad

Route::group(['middleware' => 'auth', 'prefix' => 'conectividad'], function () {

    Route::get('/map/pozos', 'ConnectivityController@mapPozos');

    //api routes
    Route::get('/api/wells', 'ConnectivityController@wells');
});

// als

Route::get('/sla/map/pozos', 'AlsController@mapPozos');
//Route::get('/sla/map/campos', 'AlsController@mapCampos');

Route::get('/api/sla/wells', 'AlsController@wells');
//Route::get('/sla/test/map', 'slaController@testMap');
//Route::post('/sla/test/map/add_data_submit', 'slaController@testMapAddDataSubmit');

// fluidos
// maps
Route::get('/fluidos/map/campos', 'fluidosController@mapCampos');
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
Route::get('/arenas/matrix', 'ArenasController@matrixSelect');
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
// demo
Route::get('/arenas/demo', 'ArenasController@demo');


// Upload
Route::get('/{project}/table_upload/{table_name}', 'UploadController@form');
Route::post('/{project}/table_upload/{table_name}', 'UploadController@match');
Route::put('/{project}/table_upload/{table_name}', 'UploadController@put');

// Test
Route::get('/test', function () {
    return view('test2');
});
Route::get('/test/api/fields', function () {
    $f = App\Field::with('wells')->where('basin_id', '=', 8)->get();
    $f->load('basin');
    return $f;
});

Route::auth();

Route::get('/dashboard', 'HomeController@dashboard');

// Admin
Route::delete('/admin/delete_sla', 'AdminController@deleteSla');
Route::delete('/admin/delete_arenas_pozos', 'AdminController@deleteArenasSandControls');
Route::delete('/admin/delete_arenas_campos', 'AdminController@deleteArenasSandControlsSummaries');
Route::delete('/admin/delete_fluidos_pozos', 'AdminController@deleteFluidosFluidOccurrences');
Route::delete('/admin/delete_fluidos_rangos', 'AdminController@deleteFluidosDensityRanges');
Route::delete('/admin/delete_conectividad_pozos', 'AdminController@deleteConectividadConnectivityOccurrences');
Route::delete('/admin/delete_multiples_pozos', 'AdminController@deleteMultiplesMultipleOccurrences');
