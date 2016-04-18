<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\FluidosCampo;

class mapController extends Controller
{
    function sla(){
        return view('map.sla');
    }

    function fluidos(){

        $campos = FluidosCampo::all();

        return view('map.fluidos',['campos' => $campos]);
    }

    function fluidosCampo($id){
        $campo = FluidosCampo::find($id);
        $fluidos = $campo->fluidos;

        return view('map.fluidos_campos', ['campo'=>$campo->name, 'fluidos' => $fluidos]);
    }
}
