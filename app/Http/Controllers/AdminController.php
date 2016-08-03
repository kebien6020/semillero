<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\AlsOccurrence;
use App\SandControl;
use App\SandControlSummary;
use App\FluidOccurrence;
use App\DensityRange;

class AdminController extends Controller
{
    private static function deleteModel($query, $name)
    {
        $affected_rows = $query->delete();
        return redirect('/dashboard')
            ->with(
                'success',
                "Eliminadas: {$affected_rows} {$name}."
            );
    }
    public function deleteSla()
    {
        return static::deleteModel(
            AlsOccurrence::query(),
            'Ocurrencias de SLA'
        );
    }

    public function deleteArenasSandControls()
    {
        return static::deleteModel(
            SandControl::query(),
            'Ocurrencias de Mecanismo de Control de Arenas'
        );
    }

    public function deleteArenasSandControlsSummaries()
    {
        return static::deleteModel(
            SandControlSummary::query(),
            'Resumenes de Control de Arenas'
        );
    }

    public function deleteFluidosFluidOccurrences()
    {
        return static::deleteModel(
            FluidOccurrence::query(),
            'Ocurrencias de Fluido'
        );
    }

    public function deleteFluidosDensityRanges()
    {
        return static::deleteModel(
            DensityRange::query(),
            'Rangos de densidades asociadas a un fluido'
        );
    }
}