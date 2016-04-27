<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\FluidosCampo;

class fluidosController extends Controller
{
    function mapCampos(){

        $campos = FluidosCampo::with('fluidos')->get();
        return view('fluidos.map_campos',['campos' => $campos]);
    }

    function campoDetail($id){
        $campo = FluidosCampo::find($id);
        $fluidos = $campo->fluidos;

        return view('fluidos.campo_detail', ['campo'=>$campo->name, 'fluidos' => $fluidos]);
    }
}
