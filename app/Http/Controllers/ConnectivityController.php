<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Well;

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
            ->with('connectivityOccurrences')
            ->get();
        return $wells;
    }
}
