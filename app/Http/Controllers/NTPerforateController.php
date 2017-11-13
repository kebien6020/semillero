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
}
