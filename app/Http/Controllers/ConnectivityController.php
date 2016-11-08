<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Well;
use App\Basin;
use App\Field;
use App\ConnectivityMethod;

class ConnectivityController extends Controller
{
    public function mapPozos()
    {
        return view('connectivity.map_pozos');
    }

    // API route
    public function wells()
    {
        $wells = Well::has('connectivityOccurrences')
            ->with(['connectivityOccurrences' => function ($query) {
                $query->orderBy('start_date', 'ASC');
                $query->with('connectivityMethod');
            }])
            ->get();
        return $wells;
    }

    // API Route
    public function methods()
    {
        return ConnectivityMethod::all(['name', 'color'])->toJson();
    }
}
