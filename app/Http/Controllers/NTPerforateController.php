<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class NTPerforateController extends Controller
{
    public function matrix()
    {
        return view('nt_perforate/matrix');
    }
    public function matrixExplanations()
    {
        return view('nt_perforate/matrix_explanations');
    }
    public function manual()
    {
        return view('nt_perforate/manual');
    }
}
