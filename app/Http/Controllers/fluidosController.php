<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

use App\Http\Requests;

use App\Field;
use App\Fluid;
use App\FluidOccurrence;
use App\DensityRange;
use App\Well;

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

    private static function occurrencesNoDensity($field_id, $fluid_id)
    {
        return FluidOccurrence::with('well.field')
            ->join('wells', 'wells.id', '=', 'fluid_occurrences.well_id')
            ->join('fields', 'fields.id', '=', 'wells.field_id')
            ->where('fluid_id', '=', $fluid_id)
            ->where('fields.id', '=', $field_id)
            ->whereNull('density')
            ->count();
    }


    // Find max density fluid occurrence in the field
    // Null fluid_id means all fluids
    private static function densityBounds($field_id, $fluid_id)
    {
        $wellsOfField = Field::findOrFail($field_id)->wells;
        $wellsOfField = $wellsOfField
            ->load('fluidOccurrence.fluid')
            ->filter(function($well) use ($fluid_id) {
                if (is_null($well->fluidOccurrence)) return false;
                if (is_null($well->fluidOccurrence->density)) return false;
                if (is_null($fluid_id)) return true;
                return $well->fluidOccurrence->fluid->id === intval($fluid_id);
            });

        $max = ['value' => -INF, 'well' => ''];
        $min = ['value' => INF, 'well' => ''];

        foreach ($wellsOfField as $well) {
            $occ = $well->fluidOccurrence;
            if ($occ->density > $max['value']) {
                $max['value'] = $occ->density;
                $max['well'] = $well->name;
            }

            if ($occ->density < $min['value']) {
                $min['value'] = $occ->density;
                $min['well'] = $well->name;
            }
        }

        $invalidMaxMin = is_infinite($max['value'])
                         || is_infinite($min['value']);

        if ($invalidMaxMin)
            $max = $min = null;

        return (object)[
            'min' => $min,
            'max' => $max,
        ];
    }

    // API function
    function densityDist($field_id, $fluid_id)
    {
        $ranges = DensityRange::where('fluid_id', '=', $fluid_id)->get();
        $fluid = Fluid::findOrFail($fluid_id);

        $bounds = self::densityBounds($field_id, $fluid_id);

        $res = [];
        foreach ($ranges as $range) {
            $occurrences = self::occurrencesInRange(
                $range->min, $range->max,
                $field_id, $fluid_id);
            if ($occurrences < 1) continue;
            $res[] = [
                'range' => ['min' => $range->min, 'max' => $range->max],
                'occurrences' => $occurrences
            ];
        }

        // Not reported density
        $occNoDensity = self::occurrencesNoDensity($field_id, $fluid_id);
        $rangeInfo = DensityRange::where('fluid_id', '=', $fluid_id)
            ->count();
        if ($occNoDensity > 0 && $rangeInfo > 0)
            $res[] = ['range' => null, 'occurrences' => $occNoDensity];

        return [
            'ranges' => $res,
            'fluid_name' => $fluid->name,
            'min' => $bounds->min,
            'max' => $bounds->max,
        ];
    }

    //API function
    function fieldInfo($id) {
        $field = Field::findOrFail($id);
        $well_count = $field->wells()->has('fluidOccurrence')->count();
        $bounds = self::densityBounds($id, null);
        return [
            'name' => $field->name,
            'min' => $bounds->min,
            'max' => $bounds->max,
            'well_count' => $well_count,
        ];
    }
}
