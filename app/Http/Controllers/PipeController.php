<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Well;
use App\Basin;
use App\Field;
use App\PipeOccurrence;

use DB;

class PipeController extends Controller
{
    public function map()
    {
        return view('pipe/map');
    }

    public function wells()
    {
        return Well::has('pipeOccurrence')
            ->whereNotNull('longitude')
            ->whereNotNull('latitude')
            ->get()
            ->load('pipeOccurrence')
            ->load('field.basin');
    }

    public function basins()
    {
        // Query required info
        $queryResult = PipeOccurrence::getQuery()
            ->select('basins.name as name', 'pipe_occurrences.year', 'basins.id as id')
            ->addSelect(DB::raw('count(distinct `pipe_occurrences`.`id`) as `occurrences`'))
            ->join('wells', 'pipe_occurrences.well_id', '=', 'wells.id')
            ->join('fields', 'wells.field_id', '=', 'fields.id')
            ->join('basins', 'fields.basin_id', '=', 'basins.id')
            ->groupBy('basins.id', 'pipe_occurrences.year')
            ->get();
        // Convert to collection
        $queryResult = collect($queryResult);

        // Put data for occurrences in the format the js code expects it
        $data = $queryResult
            ->groupBy('name')
            ->map(function ($item, $basin) {
                $occurrences = $item->map(function ($item) {
                    return [$item->year, $item->occurrences];
                });
                return [
                    'basin' => $basin,
                    'occurrences' => $occurrences,
                ];
            })
            ->values();

        // From the same query results obtain the basin names and ids
        // for the links at the bottom of the view
        $basins = $queryResult->unique('id');
        return view('pipe/basins', [
            'basins' => $basins,
            'occurrences' => $data,
        ]);
    }

    public function basinDetail($id)
    {
        $basin = Basin::findOrFail($id);
        $fields = Field::where('basin_id', '=', $id)
            ->has('wells.pipeOccurrence')
            ->get();
        $byYear = PipeOccurrence::countOccurrences('year', 'basin', $id);
        $byType = PipeOccurrence::countOccurrences('type', 'basin', $id);
        $occurrences = collect([
            'byYear' => $byYear,
            'byType' => $byType,
            'basin' => $basin->name,
        ]);
        return view('pipe/basin_detail', [
            'basin' => $basin,
            'fields' => $fields,
            'occurrences' => $occurrences,
        ]);
    }

    public function fieldDetail($id)
    {
        $field = Field::findOrFail($id);
        $wells = Well::where('field_id', '=', $id)
            ->has('pipeOccurrence')
            ->get();
        $byYear = PipeOccurrence::countOccurrences('year', 'field', $id);
        $byType = PipeOccurrence::countOccurrences('type', 'field', $id);
        $occurrences = collect([
            'byYear' => $byYear,
            'byType' => $byType,
            'basin' => $field->basin->name,
        ]);
        return view('pipe/field_detail', [
            'field' => $field,
            'wells' => $wells,
            'occurrences' => $occurrences,
        ]);
    }

    public function wellDetail($id)
    {
        $well = Well::findOrFail($id)->load('pipeOccurrence');
        return view('pipe/well_detail', [
            'well' => $well,
        ]);
    }

    public function matrix()
    {
        return view('pipe/matrix');
    }

    public function burst()
    {
        return view('pipe/burst');
    }

    public function coatings()
    {
        return view('pipe/coatings');
    }

    public function manual()
    {
        return view('pipe/manual');
    }
}
