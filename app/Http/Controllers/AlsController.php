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

    // TODO: Fetch params from database
    // NOTE: Initialized at the end of the file
    public static $testParams;
    public static $testAlternatives;

    public function matrix()
    {
        return view('als.matrix', [
            'params' => self::$testParams
        ]);
    }

    public function matrixConfig()
    {
        return view('als.matrix_config');
    }

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
        $emptyValueFunctions = self::$testAlternatives->map(function ($item) {
            return (object)[
                'alternative' => $item,
                'data' => []
            ];
        });
        return view('als.matrix_param_form', [
            'emptyValueFunctions' => $emptyValueFunctions
        ]);
    }

    public function matrixAlternatives()
    {
        return view('als.matrix_alternatives', [
            'alternatives' => self::$testAlternatives
        ]);
    }

    public function matrixAlternativeCreate()
    {
        return view('als.matrix_alternative_form');
    }

    public function matrixAlternativeEdit()
    {
        return view('als.matrix_alternative_form', [
            'name' => 'BM'
        ]);
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
       'weight' => 3,
       'valueFunctions' => collect([
           [
               'alternative' => [
                   'id' => 1,
                   'name' => 'BM'
               ],
               'data' => [['10','100'], ['50','30']]
           ],
           [
               'alternative' => [
                   'id' => 2,
                   'name' => 'BES'
               ],
               'data' => [['20', '80'], ['40', '20']]
           ]
       ])
   ],
   (object)[
       'id' => 2,
       'name' => 'Arenas',
       'weight' => 2
   ]
];

AlsController::$testAlternatives = collect([
    (object)[
        'id' => 1,
        'name' => 'BM',
    ],
    (object)[
        'id' => 2,
        'name' => 'BES',
    ]
]);
