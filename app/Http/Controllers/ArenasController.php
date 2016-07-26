<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\HtmlString;

use App\Http\Requests;

use App\Basin;
use App\Field;
use App\Sample;
use App\SampleGroup;
use App\SandControl;
use App\SandControlSummary;
use App\Well;

use Carbon\Carbon;
use DB;
use Exception;
use ErrorException;

class ArenasController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function mapPozos()
    {
        return view('arenas.map_pozos');
    }

    // API route
    public function sandControls()
    {
        $sandControls = SandControl::with('well.field.basin')->get();
        return $sandControls->toJson();
    }

    // API route
    public function sandControlGroups()
    {
        $groups = SandControl::all('group')
            ->unique('group')
            ->pluck('group')
            ->sort()->values();
        return $groups->toJson();
    }

    public function mapDetail($id)
    {
        $sandControl = SandControl::findOrFail($id);
        return view('arenas.map_detail', [
            'sandControl' => $sandControl
        ]);
    }

    public function mapEdit($id)
    {
        $well = Well::find($id);
        $allSandControls = SandControl::all();
        $generate_select = function ($name, $selected, $class = null) use ($allSandControls) {
            $options = $allSandControls
                ->pluck($name)
                ->unique()
                ->values()
                ->sort()
                ->toArray();
            $res = '<select name="' . $name;
            if ($class !== null) {
                $res .= '" class="' . $class;
            }
            $res .= '"">';
            foreach ($options as $option) {
                if ($option == null) {
                    $option = '-';
                }
                $res .= '<option value="' . $option . '"';
                if ($selected == $option) {
                    $res .= ' selected';
                }
                $res .= '>' . $option . '</option>';
            }
            $res .= '</select>';
            return new HtmlString($res);
        };
        return view('arenas.map_edit', [
            'well' => $well,
            'sandControl' => $well->sandControls->first(),
            'generate_select' => $generate_select,
        ]);
    }

    public function mapUpdate(Request $request, $id)
    {
        $sandControl = SandControl::findOrFail($id);
        $well = $sandControl->well;
        $well->longitude = $request->longitude;
        $well->latitude = $request->latitude;
        $sandControlValues = $request->except([
            'longitude',
            'latitude',
            'submit',
            '_method',
            '_token',
        ]);
        try {
            foreach ($sandControlValues as $key => $value) {
                if ($value == '-') {
                    $value = null;
                }
                if ($key == 'install_date') {
                    $value = new Carbon($value);
                }
                $sandControl[$key] = $value;
            }
        } catch (Exception $e) {
            return back()
                ->withInput()
                ->with(
                    'error',
                    'Frormato de fecha de instalación incorrecto: '
                    . $e->getMessage()
                );
        }
        $sandControl->save();
        $well->save();
        return redirect('/arenas/map/' . $id);
    }
    
    public function matrixSelect()
    {
        $tablas = SampleGroup::all();
        return view('arenas.matrix_select', ['tablas' => $tablas]);
    }

    public function matrixResults($id)
    {

        $sample_group = SampleGroup::find($id);

        if ($sample_group->samples->isEmpty()) {
            return redirect('/arenas/matrix')
                ->with('error', 'La tabla está vacia');
        }
        $average = 0;
        try {
            $average = $sample_group->getAverage();
        } catch (ErrorException $e) {
            return redirect('/arenas/matrix')
                ->with(
                    'error',
                    'Error al calcular el tamaño de grano promedio.'
                    . ' (Error: ' . $e->getMessage() . ').'
                );
        }

        // Results

        $results = (object)[];

        $plot_data = $sample_group->getPlotData();

        $x10 = $results->x10 = $plot_data->x10;
        $x60 = $results->x60 = $plot_data->x60;
        $x90 = $results->x90 = $plot_data->x90;
        $x50 = $results->x50 = $plot_data->x50;
        $x30 = $results->x30 = $plot_data->x30;
        
        $results->average = $average;
        $results->grain_type = '';
        if ($average >= 62 and $average <= 125) {
            $results->grain_type = 'Arena muy fina';
        } elseif ($average <= 250) {
            $results->grain_type = 'Arena fina';
        } elseif ($average <= 500) {
            $results->grain_type = 'Arena media';
        } elseif ($average <= 1000) {
            $results->grain_type = 'Arena gruesa';
        } elseif ($average <= 2000) {
            $results->grain_type = 'Arena muy gruesa';
        } else {
            $results->grain_type = 'Ningun rango';
        }

        if ($x10 == 0) {
            return redirect('/arenas/matrix')
                ->with(
                    'error',
                    'No hay suficientes datos para mostrar resultados'
                );
        }
        $results->u = $x60/$x10;
        $results->u_txt = '';
        if ($results->u <= 3) {
            $results->u_txt = 'Arena uniforme';
        } elseif ($results->u <= 5) {
            $results->u_txt = 'Arena no uniforme';
        } else {
            $results->u_txt = 'Arena altamente no uniforme';
        }
        
        $results->recommended = true;
        if ($results->u <= 1.5) {
            $results->suggested_1 = 'Liner ranurado';
            $results->suggested_2 = 'Empaque con Grava y Liner Ranurado';
        } elseif ($results->u <= 3) {
            $results->suggested_1 = 'Malla welded wire wrapped';
            $results->suggested_2 = 'Empaque con grava y malla';
        } elseif ($results->u <= 5) {
            $results->suggested_1 = 'Malla premium';
            $results->suggested_2 = 'Empaque con grava y malla';
        } else {
            $results->suggested_1 = 'No se recomienda control de arena tipo mecánico';
            $results->suggested_2 = null;
            $results->recommended = false;
        }

        $results->average_gravel_size = ($average*6)/25400;

        $ags = $results->average_gravel_size;
        $results->us_gravel_mesh = '';
        if ($ags >= 0.010 and $ags <=0.017) {
            $results->us_gravel_mesh = '40/60';
        } elseif ($ags <= 0.033) {
            $results->us_gravel_mesh = '20/40';
        } elseif ($ags <= 0.079) {
            $results->us_gravel_mesh = '10/20';
        } elseif ($ags <= 0.094) {
            $results->us_gravel_mesh = '8/10';
        } elseif ($ags <= 0.132) {
            $results->us_gravel_mesh = '6/8';
        } else {
            $results->us_gravel_mesh = 'No comercialmente disponible';
        }

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
            'name' =>'Rango sugerido para el tamaño de las ranuras',
            'min' => $rec_min,
            'max' => $rec_max,
        ];


        return view('arenas.matrix_results', [
            'sampleGroupId' => $id,
            'samples' => $sample_group->samples()->orderBy('grain_size')->get(),
            'results' => $results,
            'table_name' => $sample_group->name,
        ]);
    }

    // API function
    public function getMatrixPlot($id)
    {
        $sample_group = SampleGroup::find($id);
        return collect($sample_group->getPlotData())->toJson();
    }

    public function matrixNew()
    {
        return view('arenas.matrix_edit', ['edit' => false]);
    }

    // Parse table of Sample's from params
    private static function parseEditOrNew($request)
    {
        $params = collect($request->all());
        // Check name is present
        if (!$request->has('name') || empty($request->input('name'))) {
            return back()->with('error', 'No se especificó un nombre para la tabla');
        }
        $name = $request->name;

        $grain_sizes = $params->filter(function ($item, $key) {
            return starts_with($key, 'grain-size-');
        })->values();
        $frequencies = $params->filter(function ($item, $key) {
            return starts_with($key, 'frequency-');
        })->values();

        $out_of_range_flag = false;
        $table = $grain_sizes
            ->zip($frequencies)
            ->transform(function ($item) {
                return ['grain_size' => $item[0], 'frequency' => $item[1]];
            })
            ->filter(function ($item) use (&$out_of_range_flag) {
                if (is_numeric($item['grain_size'])
                    && ($item['grain_size'] < 62 || $item['grain_size'] > 2000)) {
                    $out_of_range_flag = true;
                    return false;
                }
                return is_numeric($item['grain_size'])
                    && is_numeric($item['frequency']);
            });
        $redirect = null;

        if ($table->isEmpty()) {
            return (object)[
                'empty' => true,
                'redirect' =>  back()->with('error', 'No se ingresaron datos válidos'),
            ];
        }

        return (object)[
            'empty' => false,
            'name' => $name,
            'table' => $table,
            'redirect' => $redirect,
            'out_of_range_flag' => $out_of_range_flag,
        ];
    }

    private static function saveParsedTableAndRedirect($table, $sample_group, $out_of_range)
    {
        foreach ($table as $item) {
            $sample = new Sample();
            $sample->grain_size = $item['grain_size'];
            $sample->frequency = $item['frequency'];
            $sample_group->samples()->save($sample);
        }

        $redirect =  redirect('/arenas/matrix/' . $sample_group->id);
        if ($out_of_range) {
            $redirect->with('error', 'Se ingresaron valores fuera de rango.'
                . ' Los valores reportados menores a 62 Micras o mayores a'
                . ' 2000 Micras no serán tomados en cuenta para la selección'
                . ' y diseño ya que se encuentran fuera del rango de tamaños'
                . ' de grano para arenas.');
        }

        return $redirect;
    }

    public function matrixCreate(Request $request)
    {
        $parsed = self::parseEditOrNew($request);

        if ($parsed->empty) {
            return $parsed->redirect;
        }

        // Create and save models
        $sample_group = SampleGroup::create(['name' => $parsed->name]);

        return self::saveParsedTableAndRedirect(
            $parsed->table,
            $sample_group,
            $parsed->out_of_range_flag
        );
    }

    public function matrixEdit($id)
    {
        $sample_group = SampleGroup::findOrFail($id);

        return view('arenas.matrix_edit', [
            'edit' => true,
            'sample_group' => $sample_group
        ]);
    }

    // API function
    public function sampleGroup($id)
    {
        return SampleGroup::findOrFail($id)->load('samples')->toJson();
    }

    public function matrixUpdate(Request $request, $id)
    {
        $sample_group = SampleGroup::findOrFail($id);

        $parsed = self::parseEditOrNew($request);
        if ($parsed->empty) {
            return $parsed->redirect;
        }

        //Delete all existing samples in lieau of the new uploaded ones
        $sample_group->samples()->delete();

        $sample_group->name = $parsed->name;
        $sample_group->save();

        return self::saveParsedTableAndRedirect(
            $parsed->table,
            $sample_group,
            $parsed->out_of_range_flag
        );
    }

    public function matrixDelete($id)
    {
        $sample_group = SampleGroup::findOrFail($id);
        $sample_group->delete();

        return redirect('/arenas/matrix')->with('success', 'Tabla eliminada exitosamente.');
    }

    public function camposSelect()
    {
        $basins = Basin::with('fields.sandControlSummary')->get();
        foreach ($basins as $i => $basin) {
            foreach ($basin->fields as $j => $field) {
                if (!count($field->sandControlSummary)) {
                    $basins[$i]->fields->forget($j);
                }
            }
            if (!count($basin->fields)) {
                $basins->forget($i);
            }
        }
        $basins = $basins->sortBy('name')->values();
        return view('arenas.campos_select', ['basins' => $basins]);
    }

    public function camposDetail($id)
    {
        $sandControlSummary = SandControlSummary::where(['field_id' => $id])->first();
        $sandControlSummary->load('field', 'sandControlRecommendations');
        $wells = Field::find($id)->wells()->has('sandControls')->get()->load('sandControls');
        return view('arenas.campos_detail', [
            'summary' => $sandControlSummary,
            'wells' => $wells,
        ]);
    }

    public function demo()
    {
        return view('arenas.demo');
    }
}


/*
 ****************************
 * Utility functions
 ****************************
 */

function unflatten($array, $prefix = '')
{
    $result = array();
    foreach ($array as $key => $value) {
        if (!empty($prefix)) {
            $key = preg_replace('#^' . preg_quote($prefix) . '#', '', $key);
        }
        if (strpos($key, '.') !== false) {
            parse_str('result[' . str_replace('.', '][', $key) . "]=" . $value);
        } else {
            $result[$key] = $value;
        }
    }
    return $result;
}
