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

    public function mapCampos()
    {
        return view('als.map_campos');
    }
}
