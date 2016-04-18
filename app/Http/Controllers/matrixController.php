<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class matrixController extends Controller
{
    function arenas_use($id){

        $tabla = \App\ArenasMuestrasTabla::find($id);

        return view('matrix.arenas_use', ['samples' => $tabla->samples]);
    }

    function arenas_select(){
        $tablas = \App\ArenasMuestrasTabla::all();
        return view('matrix.arenas_select', ['tablas' => $tablas]);
    }
}
