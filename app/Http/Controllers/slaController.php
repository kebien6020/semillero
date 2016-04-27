<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\SLAPozo;

class slaController extends Controller
{
    function mapPozos(){
        return view('sla.map_pozos');
    }

    function testMap(Request $request){
        $pozos = null;

        $field = $request->input('field','all');

        if ($request != 'all'){
            $pozos = SLAPozo::where('field', '=',$request->field)->get();
        } else{
            $pozos = SLAPozo::all();
        }
        return view('sla.test_map',['pozos' => $pozos, 'selected' => $field]);
    }

    function testMapAddDataSubmit(Request $request){
        $raw_data =  $request->input('raw-data');
        $lines = preg_split('/(\\r\\n)/', $raw_data);
        $pozos = [];
        foreach ($lines as $line) {
            $values = preg_split('/\\t/', $line);
            
            // Normalize null values
            foreach ($values as $key => $value) {
                if($value == 'N/A' or $value == '-' or $value == '')
                    $values[$key] = null;
            }
            $pozos[] = [
                'start_date' => $values[0],
                'end_date' => $values[1],
                'sla' => $values[2],
                'event' => $values[3],
                'field' => $values[4],
                'name' => $values[5],
                'east' => $values[6],
                'north' => $values[7],
                'longitude' => $values[8],
                'latitude' => $values[9],
                'department' => $values[10],
            ];

        }
        
        foreach ($pozos as $pozo){
            $modelCuenca = SLAPozo::create($pozo);
        }
        return redirect('/sla/test/map');
    }
}
