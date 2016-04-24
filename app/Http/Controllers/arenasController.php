<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class arenasController extends Controller
{
    function mapPozos(){
        $pozos = \App\ArenasPozo::with('arenas_campo')->get();
        return view('arenas.map_pozos', ['pozos' => $pozos->toJSON()]);
    }

    function matrixResults($id){

        $tabla = \App\ArenasMuestrasTabla::find($id);
        
        // Cast to array
        $samples = $tabla->samples->toArray();

        // Sort by grain_size
        objSort($samples, function($obj){return $obj['grain_size'];});

        // Cast to object
        foreach ($samples as $key => $sample) {
            $samples[$key] = (object) $sample;
        }

        // Average and Total
        $frequency_sum = 0;
        $value_sum = 0;

        foreach ($samples as $sample) {
            $frequency_sum += $sample->frequency;
            $value_sum += ($sample->grain_size) * ($sample->frequency);
        }

        $average = $value_sum / $frequency_sum;

        // Relative Frequency - Data for plotting
        $rel_frequency = [];    //relative_frequency
        $cummulative_rel_frequency = [];
        $plot_data = [];

        for ($i=0; $i < count($samples); $i++) { 
            $sample = $samples[$i];
            $rel_frequency[$i] = $sample->frequency / $frequency_sum *100;

            $cummulative_rel_frequency[$i] = $rel_frequency[$i];
            if ($i > 0) {
                $cummulative_rel_frequency[$i] += $cummulative_rel_frequency[$i-1];
            }

            $plot_data[$i][0] = $sample->grain_size;
            $plot_data[$i][1] = $cummulative_rel_frequency[$i];
        }


        $string_data ='';

        $string_data .= '[';
        foreach($plot_data as $point) { 
            $string_data .= '[' . $point[0] . ',' . $point[1] . '],';
        }
        $string_data .= ']';

        $x10 = interpolate_y(10,$plot_data);
        $x60 = interpolate_y(60,$plot_data);

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
        
        $results->u = $x60/$x10;
        $results->u_txt = '';
        if ($results->u <= 3) $results->u_txt = 'Arena uniforme';
        else if ($results->u <= 5) $results->u_txt = 'Arena no uniforme';
        else $results->u_txt = 'Arena altamente no uniforme';

        $results->liner = $results->u <= 4.8; // true->liner, false->gravel
        
        $results->suggested = '';
        if ($results->liner){
            $results->groove_size = 0;
            if ($results->u <= 1.5){
                $results->suggested = 'Liner ranurado';
                $results->groove_size = ($average*2)/25400;
            }
            else if ($results->u <= 3) {
                $results->suggested = 'Malla weded wire wrapped';
                $results->groove_size = ($average*3)/25400;
            }
            else {
                $results->suggested = 'Malla premium';
                $results->groove_size = ($average*3)/25400;
            }
        }
        else {  //gravel
            $results->average_gravel_size = ($average*6)/25400;
            if ($results->u <= 5){
                $results->suggested = 'Empaque con grava y liner ranurado';
            }
            else {
                $results->suggested = 'Empaque con grava y malla';
            }

            $ags = $results->average_gravel_size;
            $results->us_gravel_mesh = '';
            if ($ags >= 0.010 and $ags <=0.017) $results->us_gravel_mesh = '40/60';
            else if ($ags <= 0.033) $results->us_gravel_mesh = '20/40';
            else if ($ags <= 0.079) $results->us_gravel_mesh = '10/20';
            else if ($ags <= 0.094) $results->us_gravel_mesh = '8/10';
            else if ($ags <= 0.132) $results->us_gravel_mesh = '6/8';
            else $results->us_gravel_mesh = 'No comercialmente disponible';
        }


        return view('arenas.matrix_results', [
            'samples' => $samples,
            'cummulative_rel_frequency' => $cummulative_rel_frequency,
            'plot_data' => $string_data,
            'x10' => $x10,
            'x60' => $x60,
            'results' => $results,
        ]);
    }

    function matrixSelect(){
        $tablas = \App\ArenasMuestrasTabla::all();
        return view('arenas.matrix_select', ['tablas' => $tablas]);
    }
}


/*
 ****************************
 * Utility functions
 ****************************
 */

// Sort by callback function
function objSort(&$objArray,$indexFunction,$sort_flags=SORT_ASC) {
    $indeces = [];
    foreach($objArray as $obj) {
        $indeces[] = $indexFunction($obj);
    }
    return array_multisort($indeces,$objArray,$sort_flags);
}

// Get values for interpolation
function valuesAround($value, $arr){
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

function interpolate_y_between($value, $points){
    // (x2-x1)/(y2-y1)*(y-y1) + x1

    $x1 = $points[0][0];
    $x2 = $points[1][0];
    $y1 = $points[0][1];
    $y2 = $points[1][1];
    return ($x2 - $x1)/($y2 - $y1)*($value - $y1) + $x1;
}

function interpolate_y($value, $arr){
    return interpolate_y_between($value, valuesAround($value,$arr));
}