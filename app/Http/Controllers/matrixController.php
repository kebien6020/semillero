<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class matrixController extends Controller
{
    function arenas_use($id){

        $tabla = \App\ArenasMuestrasTabla::find($id);
        
        $samples = $tabla->samples;
        // Sort by grain_size
        $samples = objSort($samples, function($obj){return $obj->grain_size;})


        // Average and Total
        $frequency_sum = 0;
        $value_sum = 0;

        foreach ($samples as $sample) {
            $frequency_sum += $sample->frequency;
            $value_sum += $sample->grain_size * $sample->frequency;
        }

        $average = $value_sum / $frequency_sum;

        // Relative Frequency - Data for plotting
        $rel_frequency = [];    //relative_frequency
        $plot_data = [];        //grain_size vs cummulative_rel_frequency

        for ($i=0; $i < count($samples); $i++) { 
            $sample = $samples[i];
            $rel_frequency[i] = $sample->frequency / $frequency_sum;

            $plot_data[i]['x'] = $sample->grain_size;
            if ($i == 0){
                $plot_data[i]['y'] = $rel_frequency[i];
            } else {
                $plot_data[i]['y'] = $rel_frequency[i] + $rel_frequency[i-1];
            }
        }

        return view('matrix.arenas_use', [
            'samples' => $samples,
            'average' => $average,
            'total' => $frequency_sum,
            'plot_data' => $plot_data,
        ]);
    }

    function arenas_select(){
        $tablas = \App\ArenasMuestrasTabla::all();
        return view('matrix.arenas_select', ['tablas' => $tablas]);
    }
}


// Sort by callback function
function objSort(&$objArray,$indexFunction,$sort_flags=0) {
    $indices = array();
    foreach($objArray as $obj) {
        $indeces[] = $indexFunction($obj);
    }
    return array_multisort($indeces,$objArray,$sort_flags);
}