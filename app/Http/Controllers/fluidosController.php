<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

use App\Http\Requests;

use App\Field;
use App\Fluid;
use App\FluidOccurrence;
use App\DensityRange;

use DB;


class FluidosController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    function mapCampos()
    {
        return view('fluidos.map_campos');
    }

    //API function
    function fields()
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
        return $fieldsWithDistribution->toJson();
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
        return view('fluidos.map_pozos');
    }

    // API function
    function fluidOccurrences()
    {
        return FluidOccurrence::with('well.field.basin', 'fluid')
            ->get()
            ->toJson();
    }

    // API function
    function fluids()
    {
        return Fluid::all(['name', 'color'])->toJson();
    }

    private static function occurrencesInRange($min, $max, $field_id, $fluid_id)
    {
        return FluidOccurrence::with('well.field')
            ->join('wells', 'wells.id', '=', 'fluid_occurrences.well_id')
            ->join('fields', 'fields.id', '=', 'wells.field_id')
            ->where('fluid_id', '=', $fluid_id)
            ->where('fields.id', '=', $field_id)
            ->where('density', '>=', $min)
            ->where('density', '<', $max)
            ->count();
    }

    // API function
    function densityDist($field_id, $fluid_id)
    {
        $field = Field::findOrFail($field_id);
        $ranges = DensityRange::where('fluid_id', '=', $fluid_id)->get();
        $res = [];
        foreach ($ranges as $range) {
            $occurrences = self::occurrencesInRange(
                $range->min, $range->max,
                $field_id, $fluid_id);
            if ($occurrences < 1) continue;
            $res[] = (object)[
                'range' => $range->min . '-' . $range->max,
                'occurrences' => $occurrences
            ];
        }

        return ['ranges' => $res, 'field_name' => $field->name];
    }
}
