<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Support\HtmlString;

use App;

use App\Http\Requests;

use App\AlsOccurrence;
use App\Basin;
use App\DensityRange;
use App\Field;
use App\Fluid;
use App\FluidOccurrence;
use App\Sample;
use App\SampleGroup;
use App\SandControl;
use App\SandControlSummary;
use App\SandControlRecommendation;
use App\Well;

use App\Exceptions\ValueOutOfRangeException;

use Carbon\Carbon;
use Excel;
use Storage;
use Validator;

use Exception;

class UploadController extends Controller
{
    public function form($project, $table_name)
    {
        $valid = $this->validateUrl($project, $table_name);
        if (!$valid) {
            App::abort(404);
        }
        return view('table_upload.form', [
            'table_name' => $table_name,
            'columns' => $this->tables[$table_name]['columns'],
            'project' => $this->getProj($project),
        ]);
    }

    public function match(Request $request, $project, $table_name)
    {
        $valid = $this->validateUrl($project, $table_name);
        if (!$valid) {
            App::abort(404);
        }

        if ($request->has('the_file')) {
            return back()->with('error', 'Formulario incompleto.');
        }

        $file = $request->file('the_file');
        if (empty($file)) {
            return back()->with('error', 'No se especifico un archivo.');
        }
        Storage::put(
            $file->getFilename(),
            file_get_contents($file->getRealPath())
        );
        
        $filename = storage_path('app') . '/' . $file->getFilename();
        
        $excel = Excel::selectSheetsByIndex(0)->load($filename)->remember(5);
        $sheet = null;
        $file_empty = $excel->get()->isEmpty();
        $sheet_empty = false;
        if (!$file_empty) {
            $sheet = $excel->get()->first();
            $sheet_empty = $sheet->isEmpty();
        }

        if ($sheet_empty) {
            Storage::delete($file->getFilename());
            return back()->with('error', 'No se pudo leer hoja de cálculo.');
        }


        $columns = $sheet->first()->keys();

        $request->session()->put('file', $file->getFilename());

        return view('table_upload.match', [
            'uploaded_columns' => $columns,
            'columns' => $this->tables[$table_name]['columns'],
            'project' => $this->getProj($project),
            'table_name' => $table_name,
        ]);
    }

    public function put(Request $request, $project, $table_name)
    {
        set_time_limit(300);
        $valid = $this->validateUrl($project, $table_name);
        if (!$valid) {
            App::abort(404);
        }

        $filename = storage_path('app') . '/' . $request->session()->get('file');
        if (! $request->session()->has('file') or
            ! Storage::exists($request->session()->get('file'))) {
            // File already deleted, there was a previus succesfull upload
            return redirect($this->tables[$table_name]['redirect_to']);
        }

        $excel = Excel::selectSheetsByIndex(0)->load($filename, null, null, true);
        $sheet = $excel->get()->first();

        $created = null;

        try {
            $created = $this->parseTable($sheet, $table_name, $request->input('columns'));
        } catch (ValueOutOfRangeException $e) {
            $msg = 'Error: ';
            if ($e->under) {
                $msg .= 'El valor es menor a ' . $e->min . ' micras';
            } else {
                $msg .= 'El valor es mayor a ' . $e->max . ' micras';
            }
            $msg .= ' (' . $e->value . ').';
            $msg .= ' El valor debe ser mayor o igual a ' . $e->min;
            $msg .= ' micras y menor o igual a ' . $e->max . ' micras.';
            $msg .= ' Verifique que la unidad reportada sea micras.';

            return redirect()
                ->action('UploadController@form', [$project, $table_name])
                ->with('error', $msg);
        }

        Storage::delete($request->session()->get('file'));


        $message = "Datos cargados exitosamente.";
        if (!empty($created)) {
            foreach ($created as $model => $item) {
                if ($item['new'] > 0) {
                    $message .= '\n'
                        . str_plural('Creado', $item['new']) . ' '
                        . $item['new'] . ' '
                        . str_plural($model, $item['new']);
                }
                if ($item['updated'] > 0) {
                    $message .= '\n'
                        . str_plural('Actualizado', $item['updated']) . ' '
                        . $item['updated'] . ' '
                        . str_plural($model, $item['updated']);
                }
            }
        }
        $message = str_replace('\n', '<br>', $message);
        return redirect($this->tables[$table_name]['redirect_to'])
            ->with('success', $message);
    }

    private function getProj($project)
    {
        $projects = config('globals.projects');
        return (object)[
            'name' => $project,
            'display_name' => $projects[$project],
        ];
    }

    private function validateUrl($project, $table_name)
    {
        $projects = config('globals.projects');
        $valid = in_array($project, array_keys($projects), true);
        $valid &= in_array($table_name, array_keys($this->tables), true);
        $valid &= ($project == $this->tables[$table_name]['project']);
        return $valid;
    }

    private $tables;

    public function __construct()
    {
        $this->middleware('auth');
        
        $this->tables = [
            'fluidos_pozos' => [
                'project' => 'fluidos',
                'redirect_to' => '/fluidos/map/pozos',
                'columns' => [
                    ['name' => 'event',           'display_name' => 'Siglas del evento'],
                    ['name' => 'date',            'display_name' => 'Fecha de inicio'],
                    ['name' => 'density',         'display_name' => 'Densidad'],
                    ['name' => 'fluid',           'display_name' => 'Fluido de completamiento'],
                    ['name' => 'color',           'display_name' => 'Color para representar al fluido'],
                    ['name' => 'well',            'display_name' => 'Nombre común del pozo'],
                    ['name' => 'town',            'display_name' => 'Municipio'],
                    ['name' => 'longitude',       'display_name' => 'Longitud'],
                    ['name' => 'latitude',        'display_name' => 'Latitud'],
                    ['name' => 'field',           'display_name' => 'Campo'],
                    ['name' => 'field_longitude', 'display_name' => 'Longitud para el Campo'],
                    ['name' => 'field_latitude',  'display_name' => 'Latitud para el Campo'],
                    ['name' => 'vicepresidency',  'display_name' => 'Vicepresidencia'],
                    ['name' => 'basin',           'display_name' => 'Cuenca'],
                ],
                'hierarchy' => [
                    [
                        'model' => Basin::class,
                        'action' => 'groupBy',
                        'column' => 'basin',
                        'fields' => ['basin' => 'name'],
                    ],
                    [
                        'model' => Field::class,
                        'prev' => 'fields',
                        'action' => 'groupBy',
                        'column' => 'field',
                        'fields' => [
                            'field' => 'name',
                            'vicepresidency' => 'vicepresidency',
                            'field_longitude' => 'longitude',
                            'field_latitude' => 'latitude',
                        ],
                    ],
                    [
                        'model' => Well::class,
                        'prev' => 'wells',
                        'action' => 'groupBy',
                        'column' => 'well',
                        'fields' => [
                            'well' => 'name',
                            'town' => 'town',
                            'longitude' => 'longitude',
                            'latitude' => 'latitude',
                        ],
                    ],
                    [
                        'model' => FluidOccurrence::class,
                        'prev' => 'fluidOccurrence',
                        'action' => 'none',
                        'fields' => [
                            'event' => 'event',
                            'date' => 'start_date',
                            'density' => 'density',
                        ],
                    ],
                    [
                        'model' => Fluid::class,
                        'prev' => 'fluid',
                        'action' => 'groupBy',
                        'column' => 'fluid',
                        'fields' => [
                            'fluid' => 'name',
                            'color' => 'color',
                        ],
                    ],
                ],
            ],
            'fluidos_rangos' => [
                'project' => 'fluidos',
                'redirect_to' => '/fluidos/map/campos',
                'columns' => [
                    ['name' => 'fluid', 'display_name' => 'Fluido de completamiento'],
                    ['name' => 'min', 'display_name' => 'Minimo'],
                    ['name' => 'max', 'display_name' => 'Maximo'],
                ],
                'hierarchy' => [
                    [
                        'model' => Fluid::class,
                        'action' => 'groupBy',
                        'column' => 'fluid',
                        'fields' => [
                            'fluid' => 'name',
                        ],
                    ],
                    [
                        'model' => DensityRange::class,
                        'prev' => 'densityRanges',
                        'action' => 'none',
                        'fields' => [
                            'min' => 'min',
                            'max' => 'max',
                        ],
                    ]
                ],
            ],
            'arenas_pozos' => [
                'project' => 'arenas',
                'redirect_to' => '/arenas/map',
                'columns' => [
                    ['name' => 'date',              'display_name' => 'Fecha de instalación'],
                    ['name' => 'event',             'display_name' => 'Siglas del evento'],
                    ['name' => 'mechanism',         'display_name' => 'Mecanismo de control de arena'],
                    ['name' => 'completion_type',   'display_name' => 'Tipo de completamiento'],
                    ['name' => 'mesh_type',         'display_name' => 'Tipo de malla '],
                    ['name' => 'gravel_size',       'display_name' => 'Tamaño de la Grava (US Mesh)'],
                    ['name' => 'grade',             'display_name' => 'Grado'],
                    ['name' => 'joints',            'display_name' => 'Número de juntas bajadas'],
                    ['name' => 'diameter',          'display_name' => 'Diámetro Nominal (in)'],
                    ['name' => 'internal_diameter', 'display_name' => 'Diámetro Interno'],
                    ['name' => 'clearance',         'display_name' => 'Holgura (in)'],
                    ['name' => 'top',               'display_name' => 'Tope del mecanismo (ft)'],
                    ['name' => 'bottom',            'display_name' => 'Fondo del mecanismo'],
                    ['name' => 'length',            'display_name' => 'Longitud (ft)'],
                    ['name' => 'weight',            'display_name' => 'Peso Nominal (lb/ft)'],
                    ['name' => 'slots_per_feet',    'display_name' => 'Número de ranuras por pie'],
                    ['name' => 'slot_width',        'display_name' => 'Ancho de la ranura del liner (in)'],
                    ['name' => 'mesh',              'display_name' => 'Mesh'],
                    ['name' => 'slot_gauge',        'display_name' => 'Slot Gauge de la malla (in)'],
                    ['name' => 'ideal_size',        'display_name' => 'Tamaño de grano ideal'],
                    ['name' => 'well',              'display_name' => 'Nombre Común del Pozo'],
                    ['name' => 'town',              'display_name' => 'Municipio'],
                    ['name' => 'longitude',         'display_name' => 'Longitud'],
                    ['name' => 'latitude',          'display_name' => 'Latitud'],
                    ['name' => 'field',             'display_name' => 'Campo'],
                    ['name' => 'vicepresidency',    'display_name' => 'Vicepresidencia'],
                    ['name' => 'basin',             'display_name' => 'Cuenca'],
                    ['name' => 'group',             'display_name' => 'Grupo'],
                ],
                'hierarchy' => [
                    [
                        'model' => Basin::class,
                        'action' => 'groupBy',
                        'column' => 'basin',
                        'fields' => ['basin' => 'name'],
                    ],
                    [
                        'model' => Field::class,
                        'prev' => 'fields',
                        'action' => 'groupBy',
                        'column' => 'field',
                        'fields' => ['field' => 'name', 'vicepresidency' => 'vicepresidency'],
                    ],
                    [
                        'model' => Well::class,
                        'prev' => 'wells',
                        'action' => 'groupBy',
                        'column' => 'well',
                        'fields' => [
                            'well' => 'name',
                            'town' => 'town',
                            'longitude' => 'longitude',
                            'latitude' => 'latitude',
                        ],
                    ],
                    [
                        'model' => SandControl::class,
                        'prev' => 'sandControls',
                        'action' => 'none',
                        'fields' => [
                            'event' => 'event',
                            'date' => 'install_date',
                            'mechanism' => 'mechanism',
                            'completion_type' => 'completion_type',
                            'mesh_type' => 'mesh_type',
                            'gravel_size' => 'gravel_size',
                            'grade' => 'grade',
                            'joints' => 'joints',
                            'diameter' => 'diameter',
                            'internal_diameter' => 'internal_diameter',
                            'clearance' => 'clearance',
                            'top' => 'top',
                            'bottom' => 'bottom',
                            'length' => 'length',
                            'weight' => 'weight',
                            'slots_per_feet' => 'slots_per_feet',
                            'slot_width' => 'slot_width',
                            'mesh' => 'mesh',
                            'slot_gauge' => 'slot_gauge',
                            'ideal_size' => 'ideal_size',
                            'group' => 'group',
                        ],
                    ],
                ],
            ],
            'arenas_campos' => [
                'project' => 'arenas',
                'redirect_to' => '/arenas/campos',
                'columns' => [
                    ['name' => 'interval_avg_len',      'display_name' => 'Profundidad Promedio'],
                    ['name' => 'uniformity',            'display_name' => 'Coeficiente de uniformidad (U)'],
                    ['name' => 'avg_grain_size',        'display_name' => 'Tamaño de Grano Promedio'],
                    ['name' => 'grain_size_range',      'display_name' => 'Rango Tamaño de Grano'],
                    ['name' => 'type',                  'display_name' => 'Tipo de Arena'],
                    ['name' => 'uniformity_txt',        'display_name' => 'Característica de la arena'],
                    ['name' => 'installed_mechanism',   'display_name' => 'Mecanismo Usado'],
                    ['name' => 'installed_groove_size', 'display_name' => 'Ancho de la ranura (in)'],
                    ['name' => 'installed_grain_size',  'display_name' => 'Tamaño de grano'],
                    ['name' => 'installed_us_mesh',     'display_name' => 'Tamaño Grava US. Mesh'],
                    ['name' => 'remarks',               'display_name' => 'Observaciones'],
                    ['name' => 'recommended_mechanism', 'display_name' => 'Mecanismo Recomendado'],
                    ['name' => 'recommended_us_mesh',   'display_name' => 'Tamaño Grava US. Mesh Recomendada'],
                    ['name' => 'field',                 'display_name' => 'Campo'],
                    ['name' => 'vicepresidency',        'display_name' => 'Vicepresidencia'],
                    ['name' => 'basin',                 'display_name' => 'Cuenca'],
                ],
                'hierarchy' => [
                    [
                        'model' => Basin::class,
                        'action' => 'groupBy',
                        'column' => 'basin',
                        'fields' => ['basin' => 'name'],
                    ],
                    [
                        'model' => Field::class,
                        'prev' => 'fields',
                        'action' => 'groupBy',
                        'column' => 'field',
                        'fields' => ['field' => 'name', 'vicepresidency' => 'vicepresidency'],
                    ],
                    [
                        'model' => SandControlSummary::class,
                        'prev' => 'sandControlSummary',
                        'action' => 'none',
                        'fields' => [
                            'interval_avg_len' => 'interval_avg_len',
                            'uniformity' => 'uniformity',
                            'avg_grain_size' => 'avg_grain_size',
                            'grain_size_range' => 'grain_size_range',
                            'type' => 'type',
                            'uniformity_txt' => 'uniformity_txt',
                            'installed_mechanism' => 'installed_mechanism',
                            'installed_groove_size' => 'installed_groove_size',
                            'installed_grain_size' => 'installed_grain_size',
                            'installed_us_mesh' => 'installed_us_mesh',
                            'remarks' => 'remarks',
                        ],
                    ],
                    [
                        'model' => SandControlRecommendation::class,
                        'prev' => 'sandControlRecommendations',
                        'action' => 'none',
                        'fields' => [
                            'recommended_mechanism' => 'recommended_mechanism',
                            'recommended_us_mesh' => 'recommended_us_mesh',
                        ],
                    ],
                ],
            ],
            'arenas_muestras' => [
                'project' => 'arenas',
                'redirect_to' => '/arenas/matrix',
                'columns' => [
                    ['name' => 'grain_size', 'display_name' => 'Tamaño de grano [Micras]'],
                    ['name' => 'frequency',  'display_name' => 'Peso de Muestra [gr]'],
                    ['name' => 'table_name', 'display_name' => 'Nombre de la Tabla'],
                ],
                'hierarchy' => [
                    [
                        'model' => SampleGroup::class,
                        'action' => 'groupBy',
                        'column' => 'table_name',
                        'fields' => ['table_name' => 'name'],
                    ],
                    [
                        'model' => Sample::class,
                        'prev' => 'samples',
                        'action' => 'none',
                        /*'column' => 'grain_size',*/
                        'fields' => [
                            'grain_size' => ['grain_size', function ($val) {
                                if ($val < 62 or $val > 2000) {
                                    throw new ValueOutOfRangeException($val, 'grain_size', 62, 2000);
                                }
                                return $val;
                            }],
                            'frequency' => 'frequency',
                        ],
                    ],
                ],
            ],
            'sla_ocurrencias' => [
                'project' => 'sla',
                'redirect_to' => '/sla/map/pozos',
                'columns' => [
                    ['name' => 'start_date', 'display_name' => 'Fecha de Inicio'],
                    ['name' => 'end_date', 'display_name' => 'Fecha de Finalización'],
                    ['name' => 'als', 'display_name' => 'Sistema de Levantamiento'],
                    ['name' => 'event', 'display_name' => 'Siglas del Evento'],
                    ['name' => 'reason', 'display_name' => 'Causa de la intervención'],
                    ['name' => 'main_goal', 'display_name' => 'Objetivo Principal'],
                    ['name' => 'well', 'display_name' => 'Nombre Común del Pozo'],
                    ['name' => 'town', 'display_name' => 'Municipio'],
                    ['name' => 'longitude', 'display_name' => 'Longitud'],
                    ['name' => 'latitude', 'display_name' => 'Latitud'],
                    ['name' => 'field', 'display_name' => 'Campo'],
                    ['name' => 'vicepresidency', 'display_name' => 'Vicepresidencia'],
                    ['name' => 'field_longitude', 'display_name' => 'Longitud del Campo'],
                    ['name' => 'field_latitude', 'display_name' => 'Latitud del Campo'],
                    ['name' => 'basin', 'display_name' => 'Cuenca'],
                ],
                'hierarchy' => [
                    [
                        'model' => Basin::class,
                        'action' => 'groupBy',
                        'column' => 'basin',
                        'fields' => ['basin' => 'name'],
                    ],
                    [
                        'model' => Field::class,
                        'prev' => 'fields',
                        'action' => 'groupBy',
                        'column' => 'field',
                        'fields' => ['field' => 'name', 'vicepresidency' => 'vicepresidency'],
                    ],
                    [
                        'model' => Well::class,
                        'prev' => 'wells',
                        'action' => 'groupBy',
                        'column' => 'well',
                        'fields' => [
                            'well' => 'name',
                            'town' => 'town',
                            'longitude' => 'longitude',
                            'latitude' => 'latitude',
                        ],
                    ],
                    [
                        'model' => AlsOccurrence::class,
                        'prev' => 'alsOccurrences',
                        'action' => 'none',
                        'fields' => [
                            'start_date' => 'start_date',
                            'end_date' => 'end_date',
                            'als' => 'als',
                            'event' => 'event',
                            'reason' => 'reason',
                            'main_goal' => 'main_goal',
                        ],
                    ],
                ],
            ],
        ];
    }

    private function parseTable($table, $table_name, $convert_col)
    {
        // Convert headings to internal representation
        $parsed = [];
        foreach ($table as $i => $row) {
            $parsed[$i] = [];
            foreach ($convert_col as $column => $excel_column) {
                $cell = $row[$excel_column];
                $cell = trim($cell);
                if ($cell == 'N/A' or $cell == '-' or $cell == '') {
                    $cell = null;
                }
                $parsed[$i][$column] = $cell;
            }
        }
        $parsed = collect($parsed);

        if ($table_name == 'arenas_muestras') {
            $first_invalid = null;
            $valid = $parsed->reduce(function ($acc, $sample) use (&$first_invalid) {
                $res = $acc
                    && $sample['grain_size'] >= 62
                    && $sample['grain_size'] <= 2000;
                if (!$res && $first_invalid == null) {
                    $first_invalid = $sample['grain_size'];
                }
                return $res;
            }, true);
            if (!$valid) {
                throw new ValueOutOfRangeException($first_invalid, 'grain_size', 62, 2000);
            }
        }

        // Apply actions defined in $tables
        return $this->applyHierarchy($parsed, $this->tables[$table_name]['hierarchy']);
    }

    private function applyHierarchy($collection, $hierarchy, $level = 0, $parentModel = null, $created = [])
    {
        $info = $hierarchy[$level];
        if (gettype($collection) == 'array') {
            $collection = collect($collection);
        }
        $grouped = false;
        $last_level = $level >= count($hierarchy)-1;

        // groupBy if neccesary
        if ($info['action'] != 'none') {
            $collection = call_user_func(
                [$collection, $info['action']],
                $info['column']
            );
            $grouped = true;
        }
        foreach ($collection as $key => $item) {
            $sub_collection = $item;
            if ($grouped) {
                $item = $item->first();
            }
            $fields = [];
            foreach ($info['fields'] as $column => $name) {
                if (gettype($name) == 'array') {
                    $func = $name[1];
                    $name = $name[0];
                }
                $fields[$name] = $item[$column];
                // Apply custom callbacks for column specific processing
                if (isset($func)) {
                    $fields[$name] = $func($fields[$name]);
                }
                unset($func);
            }
            if (array_key_exists('column', $info)) {
                $columns = explode(',', $info['column']);
                $values = [];
                foreach ($columns as $column) {
                    $column_name = $info['fields'][$column];
                    if (gettype($column_name) == 'array') {
                        $column_name = $column_name[$i][0];
                    }
                    $values[] = [$column_name => $fields[$column_name]];
                }

                $model = call_user_func(
                    [$info['model'], 'firstOrNew'],
                    [$values]
                );
                static::addToCreated($created, $model, $model->exists);
            } else {
                $model = new $info['model'];
                static::addToCreated($created, $model);
            }
            
            $model->fill($fields);

            if ($parentModel == null) {
                $model->save();
            } else {
                $relation = call_user_func(
                    [$parentModel, $info['prev']]
                );
                if ($relation instanceof HasOneOrMany) {
                    $relation->save($model);
                } else {
                    $model->save();
                    $key = $relation->getForeignKey();
                    $parentModel->setAttribute($key, $model->id);
                    $parentModel->save();
                }
            }

            if (!$last_level) {
                $child = ($grouped) ? $sub_collection : $collection;
                $created = $this->applyHierarchy($child, $hierarchy, $level + 1, $model, $created);
            }
        }
        return $created;
    }

    private static function addToCreated(&$created, $model, $updated = false)
    {
        $class = (new \ReflectionClass($model))->getShortName();
        if (!array_key_exists($class, $created)) {
            $created[$class] = ['new' => 0, 'updated' => 0];
        }

        if ($updated) {
            ++$created[$class]['updated'];
        } else {
            ++$created[$class]['new'];
        }
    }
}
