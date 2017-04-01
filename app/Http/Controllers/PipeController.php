<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Well;
use App\Basin;
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
        $basin = Basin::findOrFail($id)
            ->load('fields');
        $occurrences = PipeOccurrence::getQuery()
            ->select('year')
            ->addSelect(DB::raw('count(distinct `pipe_occurrences`.`id`) as `occurrences`'))
            ->where('basins.id', '=', $id)
            ->join('wells', 'pipe_occurrences.well_id', '=', 'wells.id')
            ->join('fields', 'wells.field_id', '=', 'fields.id')
            ->join('basins', 'fields.basin_id', '=', 'basins.id')
            ->groupBy('pipe_occurrences.year')
            ->get();
        $occurrences = collect($occurrences);
        return view('pipe/basin_detail', [
            'basinName' => $basin->name,
            'fields' => $basin->fields,
            'occurrences' => $occurrences,
        ]);
    }
}
