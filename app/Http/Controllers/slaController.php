<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class slaController extends Controller
{
    function mapPozos(){
        return view('sla.map_pozos');
    }
}
