<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Well;

class PipeController extends Controller
{
    public function map()
    {
        return view('pipe/map');
    }

    public function wells()
    {
        return Well::has('pipeOccurrence')
            ->whereNotNull('longitude')
            ->whereNotNull('latitude')
            ->get()
            ->load('pipeOccurrence')
            ->load('field.basin');
    }
}
