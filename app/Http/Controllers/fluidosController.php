<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

use App\Http\Requests;
use App\Field;

use DB;


class fluidosController extends Controller
{
    function mapCampos(){

        //$campos = Field::with('fluids')->get();

        $campos = Field::with('wells.fluidOccurrence')->get();
        return view('fluidos.map_campos',['campos' => $campos]);
    }

    function campoDetail($id){
        /*$campo = Field::with('wells.fluidOccurrence.fluid')->find($id);
        $fluids = new Collection;
        foreach ($campo->wells as $i => $well)
        {
            $fluids->put($i, $well->fluidOccurrence->fluid);
        }
        $fluids = $fluids->groupBy('id');

        foreach ($fluids->groupBy('id') as $id => $fluid_collection)
        {

        }*/

        $res = DB::table('fluid_occurrences')
            ->join('fluids', 'fluids.id', '=', 'fluid_occurrences.fluid_id')
            ->join('wells', 'wells.id', '=', 'fluid_occurrences.well_id')
            ->join('fields', 'fields.id', '=', 'wells.field_id')->get();
        dd($res);

        return view('fluidos.campo_detail', ['campo'=>$campo->name, 'fluidos' => $fluidos]);
    }
}
