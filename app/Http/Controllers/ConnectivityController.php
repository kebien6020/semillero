<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Well;
use App\Basin;
use App\Field;
use App\ConnectivityMethod;

class ConnectivityController extends Controller
{
    public function mapPozos()
    {
        return view('connectivity.map_pozos');
    }

    public function matrix()
    {
        return 'matrix';
    }

    public function basins()
    {
        $basins = Basin::query()
            ->has('fields.wells.connectivityOccurrences')
            ->orderBy('name', 'ASC')
            ->get();
        return view('connectivity.basins', [
            'basins' => $basins
        ]);
    }
    public function basinDetail($id)
    {
        $basin = Basin::findOrFail($id);
        $fields = $basin->fields()
            ->has('wells.connectivityOccurrences')
            ->orderBy('name', 'ASC')
            ->get();
        return view('connectivity.basin_detail', [
            'basin' => $basin,
            'fields' => $fields
        ]);
    }
    public function fieldDetail($basinId, $fieldId)
    {
        $field = Field::findOrFail($fieldId);
        $distribution = $field->connectivityDistribution();
        return view('connectivity.field_detail', [
            'field' => $field,
            'basinId' => $basinId,
            'distribution' => collect($distribution->distribution)->sortBy('occurrences')->reverse(),
            'occurrenceCount' => $distribution->count,
        ]);
    }
    public function wellDetail()
    {
        return 'wellDetail';
    }

    // API route
    public function wells()
    {
        $wells = Well::has('connectivityOccurrences')
            ->with(['connectivityOccurrences' => function ($query) {
                $query->orderBy('start_date', 'ASC');
                $query->with('connectivityMethod');
            }])
            ->get();
        return $wells;
    }

    // API Route
    public function methods()
    {
        return ConnectivityMethod::all(['name', 'color'])->toJson();
    }
}
