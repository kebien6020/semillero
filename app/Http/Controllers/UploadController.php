<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Http\Requests;
use App\Basin;
use App\Field;
use App\Well;
use App\FluidOccurrence;
use App\Fluid;
use Carbon\Carbon;
use Excel;
use Illuminate\Http\Request;
use Storage;
use Validator;

class UploadController extends Controller
{

    public function form($project, $table_name)
    {
        $projects = config('globals.projects');
        $valid = in_array($project, array_keys($projects), true);
        $valid &= in_array($table_name, array_keys($this->tables), true);
        if (!$valid)
            App::abort(404);

        return view('table_upload.form', [
            'table_name' => $table_name,
            'columns' => $this->tables[$table_name]['columns'],
            'project' => $this->_get_proj($project),
        ]);
    }

    public function match(Request $request, $project, $table_name)
    {
        $projects = config('globals.projects');
        $valid = in_array($project, array_keys($projects), true);
        $valid &= in_array($table_name, array_keys($this->tables), true);
        if (!$valid)
            App::abort(404);

        // TODO: validate 'the_file' as spreadsheet file (xls, xlsx, odr, csv, etc.)
        $file = $request->file('the_file');
        Storage::put(
            $file->getFilename(),
            file_get_contents($file->getRealPath()));
        
        $filename = storage_path('app') . '/' . $file->getFilename();
        
        $excel = Excel::selectSheetsByIndex(0)->load($filename)->remember(5);
        $sheet = $excel->get()->first();
        $columns = $sheet->first()->keys();

        $request->session()->put('file', $file->getFilename());

        return view('table_upload.match', [
            'uploaded_columns' => $columns,
            'columns' => $this->tables[$table_name]['columns'],
            'project' => $this->_get_proj($project),
            'table_name' => $table_name,
        ]);
    }

    public function put(Request $request, $project, $table_name)
    {
        $filename = storage_path('app') . '/' . $request->session()->get('file');
        if (! $request->session()->has('file') or
            !Storage::exists($request->session()->get('file'))){
            // TODO: Proper error page
            return 'Error, no hay un archivo cargado';
        }

        $excel = Excel::selectSheetsByIndex(0)->load($filename, null, null, true);
        $sheet = $excel->get()->first();
        $this->parseTable($sheet, $table_name, $request->input('columns'));

        Storage::delete($request->session()->get('file'));

        return redirect('/');
    }

    private function _get_proj($project){
        $projects = config('globals.projects');
        return (object)[
            'name' => $project,
            'display_name' => $projects[$project],
        ];
    }

    private $tables;
    function __construct(){
        $this->tables = [
            'fluidos_pozos' => [
                'columns' => [
                    ['name' => 'event',          'display_name' => 'Siglas del evento'],
                    ['name' => 'date',           'display_name' => 'Fecha de inicio'],
                    ['name' => 'density',        'display_name' => 'Densidad'],
                    ['name' => 'fluid',          'display_name' => 'Fluido de completamiento'],
                    ['name' => 'color',          'display_name' => 'Color para representar al fluido'],
                    ['name' => 'well',           'display_name' => 'Nombre común del pozo'],
                    ['name' => 'town',           'display_name' => 'Municipio'],
                    ['name' => 'longitude',      'display_name' => 'Longitud'],
                    ['name' => 'latitude',       'display_name' => 'Latitud'],
                    ['name' => 'field',          'display_name' => 'Campo'],
                    ['name' => 'vicepresidency', 'display_name' => 'Vicepresidencia'],
                    ['name' => 'basin',          'display_name' => 'Cuenca'],
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
                        'model' => FluidOccurrence::class,
                        'prev' => 'fluidOccurrence',
                        'action' => 'none',
                        'column' => 'date',
                        'fields' => [
                            'event' => 'event',
                            'date' => ['start_date', function($date){
                                return $date;
                            }],
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
                'project' => 'fluidos',
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
                // TODO: Sanitize cell content (trim spaces, filter out nulls)
                $parsed[$i][$column] = $row[$excel_column];
            }
        }
        $parsed = collect($parsed);

        // Apply actions defined in $tables
        $this->applyHierarchy($parsed, $this->tables[$table_name]['hierarchy']);
    }

    private function applyHierarchy($collection, $hierarchy, $level = 0, $parentModel = null){
        $info = $hierarchy[$level];
        if (gettype($collection) == 'array')
            $collection = collect($collection);
        $grouped = false;
        $last_level = $level >= count($hierarchy)-1;

        // groupBy if neccesary
        if ($info['action'] != 'none')
        {
            $collection = call_user_func(
                [$collection, $info['action']],
                $info['column']
            );
            $grouped = true;
        }
        foreach ($collection as $key => $item)
        {
            $sub_collection = $item;
            if ($grouped)
                $item = $item->first();
            $fields = [];
            foreach ($info['fields'] as $column => $name) {
                if (gettype($name) == 'array'){
                    $func = $name[1];
                    $name = $name[0];
                }
                $fields[$name] = $item[$column];
                // Apply custom callbacks for column specific processing
                if(isset($func)){
                    $fields[$name] = $func($fields[$name]);
                }
            }
            $column_name = $info['fields'][$info['column']];
            if(gettype($column_name) == 'array')
                $column_name = $column_name[0];

            $model = call_user_func(
                [$info['model'], 'firstOrNew'],
                [$column_name => $fields[$column_name]]
            );

            $model->fill($fields);

            if ($parentModel == null)
                $model->save();
            else
            {
                $relation = call_user_func(
                    [$parentModel, $info['prev']]
                );
                if ($relation instanceof HasOneOrMany)
                    $relation->save($model);
                else {
                    $model->save();
                    $key = $relation->getForeignKey();
                    $parentModel->setAttribute($key, $model->id);
                    $parentModel->save();
                }
            }

            if (!$last_level)
            {
                $child = ($grouped) ? $sub_collection : $collection;
                $this->applyHierarchy($child, $hierarchy, $level + 1, $model);
            }
        }
    }
}
