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
        return view('connectivity.matrix');
    }

    public function matrixExplanations()
    {
        return view('connectivity.matrix_explanations');
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
        $wells = Well
            ::where([
                'field_id' => $fieldId
            ])
            ->has('connectivityOccurrences')
            ->get();
        $wells = $wells->map(function ($well) {
            return collect([
                'name' => $well->name,
                'color' => $well->lastConnectivityOccurrence()->connectivityMethod->color,
                'method' => $well->lastConnectivityOccurrence()->connectivityMethod->name,
            ]);
        });
        $distribution = $wells
            ->groupBy('method')
            ->map(function ($well, $key) {
                $count = $well->count();
                $method = $key;
                $color = $well[0]['color'];
                return collect([
                    'count' => $count,
                    'name' => $method,
                    'color' => $color,
                ]);
            })
            ->values();
        $numWells = $wells->count();
        return view('connectivity.field_detail', [
            'field' => $field,
            'basinId' => $basinId,
            'distribution' => collect($distribution)->sortBy('count')->reverse(),
            'wellCount' => $numWells,
            'wells' => $wells,
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
