<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Well;
use App\Completion;

class MultipleController extends Controller
{
    public function mapPozos()
    {
        return view('multiple.map_pozos');
    }

    public function matrix()
    {
        return view('multiple.matrix');
    }

    public function matrixExplanations()
    {
        return view('multiple.matrix_explanations');
    }

    // API function
    public function wells()
    {
        $wells = Well::has('multipleOccurrences')
            ->with('multipleOccurrences.completion')
            ->get();
        return $wells;
    }

    // API function
    public function completions()
    {
        return Completion::all(['name', 'color']);
    }
}
