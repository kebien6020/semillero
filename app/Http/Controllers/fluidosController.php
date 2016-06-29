<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

use App\Http\Requests;

use App\Field;
use App\Fluid;
use App\FluidOccurrence;

use DB;


class FluidosController extends Controller
{
    function mapCampos()
    {
        $fields = Field::whereNotNull('longitude', 'and')->whereNotNull('latitude')->get();
        $fields->load('wells.fluidOccurrence');
        foreach ($fields as $i => $field) {
            foreach ($field->wells as $j => $well) {
                if (!count($well->fluidOccurrence))
                    $fields[$i]->wells->forget($j);
            }
            if (!count($field->wells))
                $fields->forget($i);
        }
        $fields = $fields->values();
        $fieldsWithDistribution = [];
        foreach ($fields as $field) {
            $fieldsWithDistribution[] = (object)[
                'id' => $field->id,
                'name' => $field->name,
                'longitude' => $field->longitude,
                'latitude' => $field->latitude,
                'distribution' => $field->fluidDistribution(),
            ];
        }
        $fieldsWithDistribution = collect($fieldsWithDistribution);
        return view('fluidos.map_campos', ['fields' => $fieldsWithDistribution->toJson()]);
    }

    function campoDetail($id)
    {
        $res = DB::table('fluid_occurrences')
            ->join('fluids', 'fluids.id', '=', 'fluid_occurrences.fluid_id')
            ->join('wells', 'wells.id', '=', 'fluid_occurrences.well_id')
            ->join('fields', 'fields.id', '=', 'wells.field_id')->get();
        dd($res);

        return view('fluidos.campo_detail', ['campo'=>$campo->name, 'fluidos' => $fluidos]);
    }

    function mapPozos()
    {
        $occurrences = FluidOccurrence::with('well.field.basin', 'fluid')->get();
        $fluids = Fluid::all(['name', 'color']);
        return view('fluidos.map_pozos',[
            'occurrences' => $occurrences->toJson(),
            'fluids' => $fluids->toJson(),
        ]);
    }
}
