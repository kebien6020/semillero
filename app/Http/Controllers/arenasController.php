<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Basin;
use App\Field;
use App\Sample;
use App\SampleGroup;
use App\SandControl;
use App\SandControlSummary;

use DB;

class ArenasController extends Controller
{
    function mapPozos()
    {
        $sandControls = SandControl::with('well.field.basin')->get();
        $groups = SandControl::all('group')
            ->unique('group')
            ->pluck('group')
            ->sort()->values();
        return view('arenas.map_pozos', [
            'sandControls' => $sandControls->toJson(),
            'groups' => $groups->toJson(),
        ]);
    }

    function mapDetail($id)
    {
        $sandControl = SandControl::find($id);
        $wellsOfField = Field::with('wells.sandControls')->find($sandControl->well->field->id)->wells;
        $field_avg_len = $wellsOfField->pluck('sandControls')->flatten()->avg('length');
        return view('arenas.map_detail', [
            'sandControl' => $sandControl,
            'field_avg_len' => $field_avg_len,
        ]);
    }
    
    function matrixSelect()
    {
        $tablas = SampleGroup::all();
        return view('arenas.matrix_select', ['tablas' => $tablas]);
    }

    function matrixResults($id)
    {

        $tabla = SampleGroup::find($id);
        
        $stats = $tabla->stats();

        $average = $stats['average'];
        $plot_data = $stats['plot_data'];

        $x10 = interpolate_y(10, $plot_data);
        $x60 = interpolate_y(60, $plot_data);
        $x90 = interpolate_y(90, $plot_data);
        $x50 = interpolate_y(50, $plot_data);
        $x30 = interpolate_y(30, $plot_data);

        // Results

        $results = (object)[];
        
        $results->average = $average;
        $results->grain_type = '';
        if ($average >= 62 and $average <= 125) $results->grain_type = 'Arena muy fina';
        else if ($average <= 250) $results->grain_type = 'Arena fina';
        else if ($average <= 500) $results->grain_type = 'Arena media';
        else if ($average <= 1000) $results->grain_type = 'Arena gruesa';
        else if ($average <= 2000) $results->grain_type = 'Arena muy gruesa';
        else $results->grain_type = 'Ningun rango';
        
        $results->x10 = $x10;
        $results->x60 = $x60;
        $results->x90 = $x90;
        $results->x50 = $x50;
        $results->x30 = $x30;
        
        $results->u = $x60/$x10;
        $results->u_txt = '';
        if ($results->u <= 3) $results->u_txt = 'Arena uniforme';
        else if ($results->u <= 5) $results->u_txt = 'Arena no uniforme';
        else $results->u_txt = 'Arena altamente no uniforme';
        
        $results->recommended = true;
        if ($results->u <= 1.5)
        {
            $results->suggested_1 = 'Liner ranurado';
            $results->suggested_2 = 'Empaque con Grava y Liner Ranurado';
        }
        else if ($results->u <= 3)
        {
            $results->suggested_1 = 'Malla weded wire wrapped';
            $results->suggested_2 = 'Empaque con grava y malla';
        }
        else if ($results->u <= 5)
        {
            $results->suggested_1 = 'Malla premium';
            $results->suggested_2 = 'Empaque con grava y malla';
        }
        else {
            $results->suggested_1 = 'No se recomienda control de arena tipo mecánico';
            $results->suggested_2 = null;
            $results->recommended = false;
        }

        $results->average_gravel_size = ($average*6)/25400;

        $ags = $results->average_gravel_size;
        $results->us_gravel_mesh = '';
        if ($ags >= 0.010 and $ags <=0.017) $results->us_gravel_mesh = '40/60';
        else if ($ags <= 0.033) $results->us_gravel_mesh = '20/40';
        else if ($ags <= 0.079) $results->us_gravel_mesh = '10/20';
        else if ($ags <= 0.094) $results->us_gravel_mesh = '8/10';
        else if ($ags <= 0.132) $results->us_gravel_mesh = '6/8';
        else $results->us_gravel_mesh = 'No comercialmente disponible';

        $results->config = (object)[];

        $results->config = [
            (object)[
                'name' => 'Coberly',
                'min' => $x90/25400,
                'max' => 2*$x90/25400,
            ],
            (object)[
                'name' => 'Coberly Actualizado',
                'min' => 2*$x90/25400,
                'max' => 3*$x90/25400,
            ],
            (object)[
                'name' => 'Penberthy',
                'min' => 2*$average/25400,
                'max' => 3*$average/25400,
            ],
            (object)[
                'name' => 'Regent Energy (Canada Reference)',
                'min' => 2*$x30/25400,
                'max' => 3.5*$x50/25400,
            ],
        ];

        $rec_min = collect($results->config)->pluck('min')->min();
        $rec_max = collect($results->config)->pluck('max')->max();

        $results->config[] = (object)[
            'name' =>'Rango Sugerido Tamaño de Ranura',
            'min' => $rec_min,
            'max' => $rec_max,
        ];


        return view('arenas.matrix_results', [
            'samples' => $tabla->samples()->orderBy('grain_size')->get(),
            'plot_data' => json_encode($plot_data),
            'x10' => $x10,
            'x60' => $x60,
            'x90' => $x90,
            'x50' => $x50,
            'x30' => $x30,
            'results' => $results,
        ]);
    }


    function listCampos()
    {
        $basins = Basin::with('fields.sandControlSummary')->get();
        foreach ($basins as $i => $basin) {
            foreach ($basin->fields as $j => $field) {
                if (!count($field->sandControlSummary))
                    $basins[$i]->fields->forget($j);
            }
            if (!count($basin->fields))
                $basins->forget($i);
        }
        $basins = $basins->sortBy('name')->values();
        return view('arenas.list_campos', ['basins' => $basins]);
    }

    function campoDetail($id)
    {
        $sandControlSummary = SandControlSummary::where(['field_id' => $id])->first();
        $sandControlSummary->load('field', 'sandControlRecommendations');
        return view('arenas.view_campo', ['summary' => $sandControlSummary]);
    }


}


/*
 ****************************
 * Utility functions
 ****************************
 */

// Get values for interpolation
function valuesAround($value, $arr)
{
    // We can't interpolate with less than 2 points
    if (count($arr) <= 1) return null;
    // When the value is too small, interpolate with the first 2 points
    else if ($value < $arr[0][1])
        return [$arr[0],$arr[1]];
    // When it's too big, interpolate with the last 2 points. This shouldn't happen
    else if ($value > $arr[count($arr)-1][1])
        return [$arr[count($arr)-2], $arr[count(arr)-1]];
    $i = 0;
    do {
        $point1 = $arr[$i];
        $point2 = $arr[$i+1];

        $i++;
    } while (!($point1[1] <= $value and $point2[1] > $value));
    return [$point1, $point2];
}

function interpolate_y_between($value, $points)
{
    $x1 = $points[0][0];
    $x2 = $points[1][0];
    $y1 = $points[0][1];
    $y2 = $points[1][1];
    return ($x2 - $x1)/($y2 - $y1)*($value - $y1) + $x1;
}

function interpolate_y($value, $arr)
{
    return interpolate_y_between($value, valuesAround($value,$arr));
}

function unflatten($array,$prefix = '')
{
    $result = array();
    foreach($array as $key=>$value)
    {
        if(!empty($prefix))
        {
            $key = preg_replace('#^'.preg_quote($prefix).'#','',$key);
        }
        if(strpos($key,'.') !== false)
        {
            parse_str('result['.str_replace('.','][',$key)."]=".$value);
        }
        else $result[$key] = $value;
    }
    return $result;
}