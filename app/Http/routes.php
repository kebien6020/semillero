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

Route::get('/map/sla', 'mapController@sla');

Route::get('/map/fluidos', 'mapController@fluidos');
Route::get('/map/fluidos/{id}', 'mapController@fluidosCampo');

Route::get('/matrix/arenas','matrixController@arenas_select');
Route::get('/matrix/arenas/{id}', 'matrixController@arenas_use');
Route::get('/map/arenas', 'mapController@arenasPozos');
