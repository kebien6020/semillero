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

/*
    Here is a good place to understand the application flow.

    If you want to know how something works, just take note
    of the url and come here looking for the responsible
    controller function. Then look at that.

    Most route groups use the `auth` middleware. That is because
    access to most of the application is restricted to users
    only.
*/

// Uncoment this to make small tests right here without defining
// a new controller or function
// use Illuminate\Http\Request;

// # Home
Route::get('/', 'HomeController@home');

// # Pipe (Tuberías)

Route::group(['prefix' => 'tuberias', 'middleware' => 'auth'], function () {

    // `/map` and related API routes
    Route::get('/map', 'PipeController@map');
    Route::get('/api/pozos', 'PipeController@wells');

    // All these routes compose the tendency matrix.
    // This is basically just a exlorer/browser
    Route::get('/cuencas', 'PipeController@basins');
    Route::get('/cuencas/{id}', 'PipeController@basinDetail');
    Route::get('/campos/{id}', 'PipeController@fieldDetail');
    Route::get('/pozos/{id}', 'PipeController@wellDetail');

    // ## Matrix
    Route::get('/matriz', 'PipeController@matrix');
    Route::get('/estallido', 'PipeController@burst');
});

// # Multiple (Completamientos multiples)

Route::group(['prefix' => 'multiples', 'middleware' => 'auth'], function () {

    // `/map` and related API routes
    Route::get('/map/pozos', 'MultipleController@mapPozos');
    // Get the wells that have a related MultipleOccurrence
    // and includes the occurrence in the response
    Route::get('/api/wells', 'MultipleController@wells');
    // Get a list with the types of occurrences and their corresponding colors
    Route::get('/api/completions', 'MultipleController@completions');

    // Selection matrix
    Route::get('/matrix', 'MultipleController@matrix');
    // A plain document with sections represented by ids
    // so that you can use `#<topic>` at the end of the url
    Route::get('/matrix/explanations', 'MultipleController@matrixExplanations');

    // Plain document with a youtube video about the usage of the module
    Route::get('/manual', 'MultipleController@manual');
});

// # Connectivity (Conectividad)

Route::group(['middleware' => 'auth', 'prefix' => 'conectividad'], function () {

    // map
    Route::get('/map/pozos', 'ConnectivityController@mapPozos');
    // Get the wells that have a related ConnectivityOccurrence
    // and includes the occurrence in the response
    Route::get('/api/wells', 'ConnectivityController@wells');
    // Get a list with the types of connectivity
    Route::get('/api/methods', 'ConnectivityController@methods');

    // Tendency Matrix
    // TODO: Make the urls only one level deep, as the ones
    //       from Pipe's matrix
    Route::get('/basins', 'ConnectivityController@basins');
    Route::get('/basins/{id}', 'ConnectivityController@basinDetail');
    Route::get('/basins/{basinId}/fields/{fieldId}', 'ConnectivityController@fieldDetail');
    Route::get('/basins/{basinId}/fields/{fieldId}/wells/{wellId}', 'ConnectivityController@wellDetail');

    // Selection matrix
    Route::get('/matrix', 'ConnectivityController@matrix');
    // A plain document with sections represented by ids
    // so that you can use `#<topic>` at the end of the url
    Route::get('/matrix/explanations', 'ConnectivityController@matrixExplanations');

    // Plain document with a youtube video about the usage of the module
    Route::get('/manual', 'ConnectivityController@manual');
});

// # Als (Sistemas de Levantamiento Artificial)

Route::group(['middleware' => 'auth', 'prefix' => 'sla'], function () {

    // ## Map
    // Main map route
    Route::get('/map/pozos', 'AlsController@mapPozos');
    // API route for map it provides info about the wells with at least
    // one `AlsOccurrence` and for each well it provides the
    // `AlsOccurrence`s itself (as als_occurrences)
    Route::get('/api/wells', 'AlsController@wells');

    // ## Matrix
    // Main matrix route, it is mostly client-side so the server side is
    // not that complex
    Route::get('/matrix', 'AlsController@matrix');

    // Config routes for the matrix, they allow the user to
    // tune the matrix with their own values
    Route::get('/matrix/config', 'AlsController@matrixConfig');

    // Shortcut for configuring the weights of all criteria
    Route::get('/matrix/weights', 'AlsController@matrixWeights');
    Route::put('/matrix/weights', 'AlsController@matrixWeightsUpdate');

    // Configuration for the criteria
    Route::get('/matrix/value_func', 'AlsController@matrixValueFunc');
    Route::get('/matrix/criteria/new', 'AlsController@matrixCriterionNew');
    Route::get('/matrix/criteria/{id}', 'AlsController@matrixCriterionEdit');
    Route::post('/matrix/criteria', 'AlsController@matrixCriterionCreate');
    Route::put('/matrix/criteria/{id}', 'AlsController@matrixCriterionUpdate');
    // Configuration for the alternatives
    Route::get('/matrix/alternatives', 'AlsController@matrixAlternatives');
    Route::get('/matrix/alternatives/new', 'AlsController@matrixAlternativeNew');
    Route::get('/matrix/alternatives/{id}', 'AlsController@matrixAlternativeEdit');
    Route::post('/matrix/alternatives', 'AlsController@matrixAlternativeCreate');
    Route::put('/matrix/alternatives/{id}', 'AlsController@matrixAlternativeUpdate');

    // ## Manual
    // A simple page with an embeded video from youtube explaining how to use
    // the module
    Route::get('/manual', 'AlsController@manual');
});

// # fluidos (Fluidos de Completamiento)
// TODO: Change the name in the code to Fluids
// TODO: Use a route group. As the API routes are inconsistently named. And
//       are used in the code just like that. A route group is not that
//       trivial of a change.

// ## Maps

// This project has two kind of maps, one grouped by fields and another
// just by wells
Route::get('/fluidos/map/campos', 'fluidosController@mapCampos');
Route::get('/fluidos/map/pozos', 'fluidosController@mapPozos');

// API routes for the maps
Route::get('/api/fluidos/density_dist/{field_id}/{fluid_id}', 'fluidosController@densityDist');
Route::get('/api/fluidos/fluid_occurrences', 'fluidosController@fluidOccurrences');
Route::get('/api/fluidos/fluids', 'fluidosController@fluids');
Route::get('/api/fluidos/fields', 'fluidosController@fields');
Route::get('/api/fluidos/field_info/{id}', 'fluidosController@fieldInfo');

// ## Matrix
// Main matrix route
Route::get('/fluidos/matrix', 'fluidosController@matrix');

// # Arenas (Métodos de Control de Arenas)

// ## Map
// Each well has a detail view with option to edit the data
Route::get('/arenas/map', 'ArenasController@mapPozos');
Route::get('/arenas/map/{id}', 'ArenasController@mapDetail');
Route::get('/arenas/map/{id}/edit', 'ArenasController@mapEdit');
Route::put('/arenas/map/{id}', 'ArenasController@mapUpdate');
// Api routes for the map
Route::get('/api/arenas/sand_controls', 'ArenasController@sandControls');
Route::get('/api/arenas/sand_control_groups', 'ArenasController@sandControlGroups');

// ## Matrix
// In this matrix the user provides a data table (SampleGroup) and the
// reccommendations are given based on that
// information (and some algorithms)

// List the `SampleGroup`s
Route::get('/arenas/matrix', 'ArenasController@matrixSelect');
// View the results for a SampleGroup
Route::get('/arenas/matrix/{id}', 'ArenasController@matrixResults');
// Create form
Route::get('/arenas/matrix_new', 'ArenasController@matrixNew');
// Create
Route::post('/arenas/matrix', 'ArenasController@matrixCreate');
// Edit form
Route::get('/arenas/matrix/{id}/edit', 'ArenasController@matrixEdit');
// Edit
Route::put('/arenas/matrix/{id}', 'ArenasController@matrixUpdate');
// Delete
Route::delete('/arenas/matrix/{id}', 'ArenasController@matrixDelete');

// API routes for the matrix
Route::get('/api/arenas/get_matrix_plot/{id}', 'ArenasController@getMatrixPlot');
Route::get('/api/arenas/sample_group/{id}', 'ArenasController@sampleGroup');

// ## Field Level Reccommendations
Route::get('/arenas/campos', 'ArenasController@camposSelect');
Route::get('/arenas/campos/{id}', 'ArenasController@camposDetail');
// ## Manual
Route::get('/arenas/demo', 'ArenasController@demo');


// # Upload
// All the project's raw data is uploaded as an excel table and it is
// all done through this controller. It has a lot of black magic
// so it needs a refactor.

// Upload form
Route::get('/{project}/table_upload/{table_name}', 'UploadController@form');
// Match the columns from the file with the required ones
Route::post('/{project}/table_upload/{table_name}', 'UploadController@match');
// Actually store the data into the database
Route::put('/{project}/table_upload/{table_name}', 'UploadController@put');

// # Authentication
// Copy the code from Route::auth but remove the registration routes

// Authentication Routes...
Route::get('login', 'Auth\AuthController@showLoginForm');
Route::post('login', 'Auth\AuthController@login');
Route::get('logout', 'Auth\AuthController@logout');

// Registration Routes... removed!

// Password Reset Routes...
Route::get('password/reset/{token?}', 'Auth\PasswordController@showResetForm');
Route::post('password/email', 'Auth\PasswordController@sendResetLinkEmail');
Route::post('password/reset', 'Auth\PasswordController@reset');

// # Dashboard
// The dashboard is currently an information control panel.
// It mainly lets you remove data massively on a per-project basis
Route::get('/dashboard', 'HomeController@dashboard');

// # Admin
// TODO: Make an admin middleware and restrict some routes (like this ones)
//       to admin only. The User model already has an is_admin field.
Route::group(['prefix' => '/admin'], function () {
    Route::delete('/delete_sla', 'AdminController@deleteSla');
    Route::delete('/delete_arenas_pozos', 'AdminController@deleteArenasSandControls');
    Route::delete('/delete_arenas_campos', 'AdminController@deleteArenasSandControlsSummaries');
    Route::delete('/delete_fluidos_pozos', 'AdminController@deleteFluidosFluidOccurrences');
    Route::delete('/delete_fluidos_rangos', 'AdminController@deleteFluidosDensityRanges');
    Route::delete('/delete_conectividad_pozos', 'AdminController@deleteConectividadConnectivityOccurrences');
    Route::delete('/delete_multiples_pozos', 'AdminController@deleteMultiplesMultipleOccurrences');
    Route::delete('/delete_tuberias_pozos', 'AdminController@deleteTuberiasPipeOccurrences');
});
