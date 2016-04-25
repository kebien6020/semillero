<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\ArenasCuenca;
use App\ArenasCampo;
use App\ArenasMuestrasTabla;
use App\ArenasSandControl;

use DB;

class arenasController extends Controller
{
    function mapPozos(){
        $pozos = \App\ArenasPozo::with('arenas_campo')->get();
        return view('arenas.map_pozos', ['pozos' => $pozos->toJSON()]);
    }

    function mapAddData(){
        return view('arenas.map_add_data');
    }

    function matrixResults($id){

        $tabla = ArenasMuestrasTabla::find($id);
        
        $stats = $tabla->stats();

        $average = $stats['average'];
        $plot_data = $stats['plot_data'];

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

        $results->gravel = $results->u > 4.8; // true->gravel, false->liner
        
        $results->suggested = '';
        $results->groove_size = 0;
        if (!$results->gravel){
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
                $results->groove_size = ($average*2)/25400;
            }
            else {
                $results->suggested = 'Empaque con grava y malla';
                $results->groove_size = ($average*3)/25400;
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
            'samples' => $tabla->samples()->orderBy('grain_size')->get(),
            'plot_data' => json_encode($plot_data),
            'x10' => $x10,
            'x60' => $x60,
            'results' => $results,
        ]);
    }

    function matrixSelect(){
        $tablas = \App\ArenasMuestrasTabla::all();
        return view('arenas.matrix_select', ['tablas' => $tablas]);
    }

    function listCampos(){
        $campos_cuencas = ArenasCuenca::query()
        ->join('arenas_campos', 'arenas_campos.arenas_cuenca_id', '=', 'arenas_cuencas.id')
        ->join('arenas_sand_controls', 'arenas_sand_controls.arenas_campo_id', '=', 'arenas_campos.id')
        ->select([
            'arenas_campos.name',
            'arenas_campos.id',
            'arenas_cuencas.name as cuenca_name',
            'arenas_cuencas.id as cuenca_id',
        ])
        ->distinct()
        ->orderBy('arenas_cuencas.name','ASC')
        ->orderBy('arenas_campos.name', 'ASC')
        ->get();
        $cuencas = [];
        foreach ($campos_cuencas as $campo_cuenca){
            $id = $campo_cuenca->cuenca_id;
            if (array_key_exists($id, $cuencas)){
                $cuencas[$id]->campos[] = (object)[
                    'id' => $campo_cuenca->id,
                    'name' => $campo_cuenca->name,
                ];

            } else {
                $cuencas[$id] = (object)[];
                $cuencas[$id]->name = $campo_cuenca->cuenca_name;
                $cuencas[$id]->campos = [(object)[
                    'id' => $campo_cuenca->id,
                    'name' => $campo_cuenca->name,
                ]];
            }
        }
        return view('arenas.list_campos', ['cuencas' => $cuencas]);
    }

    function viewCampo($campo_id){
        $campo = ArenasCampo::find($campo_id);
        $sandControls = $campo->sandControls;
        return view('arenas.view_campo', ['sandControls' => $sandControls, 'campo' => $campo->name]);
    }

    function camposAddData(){
        return view('arenas.campos_add_data');
    }

    function camposAddDataSubmit(Request $request){
        $raw_data =  $request->input('raw-data');
        $lines = preg_split('/(\\r\\n)/', $raw_data);
        $cuencas = [];
        foreach ($lines as $line) {
            $values = preg_split('/\\t/', $line);
            
            // Normalize null values
            foreach ($values as $key => $value) {
                if($value == 'N/A' or $value == '-' or $value == '')
                    $values[$key] = null;
            }

            $campo_name = $values[1];
            $cuenca_name = $values[2];
            $sand_control_i = 0;

            if (!array_key_exists($cuenca_name, $cuencas)){
                $cuencas[$cuenca_name] = [];
            }
            if (!array_key_exists($campo_name, $cuencas[$cuenca_name])){
                $cuencas[$cuenca_name][$campo_name] = [];
            }
            while (!empty($cuencas[$cuenca_name][$campo_name][$sand_control_i])){
                $sand_control_i++;
            }
            $cuencas[$cuenca_name][$campo_name][$sand_control_i] = [
                'interval_depth' => $values[0],
                'uniformity_coefficient' => $values[3],
                'grain_size' => $values[4],
                'grain_size_range' => $values[5],
                'sand_type' => $values[6],
                'sand_uniformity' => $values[7],
                'installed_mechanism' => $values[8],
                'installed_groove_thickness' => $values[9],
                'installed_gravel_size' => $values[10],
                'installed_gravel_us' => $values[11],
                'recommended_mechanism' => $values[12],
                'recommended_groove_thickness' => $values[13],
                'recommended_gravel_size' => $values[14],
                'recommended_gravel_us' => $values[15],
                'alternative_mechanism' => $values[16],
                'alternative_groove_thickness' => $values[17],
                'alternative_gravel_size' => $values[18],
                'alternative_gravel_us' => $values[19],
            ];

        }
        
        foreach ($cuencas as $name => $campos){
            $modelCuenca = ArenasCuenca::firstOrCreate(['name' => $name]);
            foreach ($campos as $campo_name => $sandControls){
                $modelCampo = $modelCuenca->campos()->firstOrCreate(['name' => $campo_name]);
                foreach ($sandControls as $sandControl){
                    $modelCampo->sandControls()->save(new ArenasSandControl($sandControl));
                }
            }
        }
        return redirect('/arenas/campos');
    }
}


/*
 ****************************
 * Utility functions
 ****************************
 */

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