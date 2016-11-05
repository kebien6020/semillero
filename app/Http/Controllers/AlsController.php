<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\AlsOccurrence;
use App\Well;

class AlsController extends Controller
{
    public function mapPozos()
    {
        return view('als.map_pozos');
    }

    // API Function
    public function wells()
    {
        return Well::has('alsOccurrences')
            ->whereNotNull('longitude')
            ->whereNotNull('latitude')
            ->get()
            ->load(['alsOccurrences' => function ($query) {
                $query->orderBy('start_date', 'asc');
            }])
            ->load('field.basin');
    }

    public function matrix()
    {
        return view('als.matrix');
    }

    public function matrixConfig()
    {
        return view('als.matrix_config');
    }

    // TODO: Fetch params from database
    // NOTE: Initialized at the end of the file
    public static $testParams;

    public function matrixValueFunc()
    {
        return view('als.matrix_value_func', [
            'params' => self::$testParams
        ]);
    }

    public function matrixWeights()
    {
        return view('als.matrix_weights', [
            'params' => self::$testParams
        ]);
    }

    public function matrixParamEdit()
    {
        return view('als.matrix_param_form', [
            'param' => self::$testParams[0]
        ]);
    }

    public function matrixParamCreate()
    {
        return view('als.matrix_param_form', []);
    }

    public function mapCampos()
    {
        return view('als.map_campos');
    }
}

AlsController::$testParams = [
   (object)[
       'id' => 1,
       'name' => 'Viscosidad',
       'weight' => 3
   ],
   (object)[
       'id' => 2,
       'name' => 'Arenas',
       'weight' => 2
   ]
];
