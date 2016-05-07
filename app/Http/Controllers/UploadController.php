<?php

namespace App\Http\Controllers;


use App\Http\Requests;
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
        $basins = $this->parseTable($sheet, $table_name, $request->input('columns'));

        Storage::delete($request->session()->get('file'));

        return $basins->toJson();
    }

    private function _get_proj($project){
        $projects = config('globals.projects');
        return (object)[
            'name' => $project,
            'display_name' => $projects[$project],
        ];
    }

    private $tables = [
        'fluidos_pozos' => [
            'columns' => [
                ['name' => 'field',   'display_name' => 'Campo'],
                ['name' => 'basin',   'display_name' => 'Cuenca'],
                ['name' => 'town',    'display_name' => 'Municipio'],
                ['name' => 'north',   'display_name' => 'Norte'],
                ['name' => 'east',    'display_name' => 'Este'],
                ['name' => 'name',    'display_name' => 'Nombre común del pozo'],
                ['name' => 'company', 'display_name' => 'Operador'],
                ['name' => 'event',   'display_name' => 'Siglas del evento'],
                ['name' => 'date',    'display_name' => 'Fecha de inicio'],
                ['name' => 'fluid',   'display_name' => 'Fluido de completamiento'],
                ['name' => 'density', 'display_name' => 'Densidad'],
            ],
            'hierarchy' => [
                'basin',
                'field',
                'name',
            ],
            'project' => 'fluidos',
            'db_table' => 'fluidos_pozos',
        ],
    ];

    private function parseTable($table, $table_name, $convert_col)
    {
        // Convert headings to internal representation
        $parsed = [];
        foreach ($table as $i => $row) {
            $parsed[$i] = [];
            foreach ($row as $title => $cell) {
                $column = array_search($title, $convert_col);
                if(!$column) continue;
                $parsed[$i][$column] = $cell;
            }
        }

        // Apply actions defined in $tables
        $parsed = $this
            ->applyHierarchy($parsed, $this->tables[$table_name]['hierarchy']);
        return $parsed;
    }

    private function applyHierarchy($array, $hierarchy, $level = 0){
        $collection = collect($array);

        if ($level >= count($hierarchy)-1)
        {
            return $collection
                ->keyBy($hierarchy[$level])
                ->except($hierarchy[$level]);
        }
        
        $collection = $collection
            ->groupBy($hierarchy[$level])
            ->except($hierarchy[$level]);
        foreach ($collection as $key => $element)
        {
            $collection[$key] = $this
                ->applyHierarchy($element, $hierarchy, $level + 1);
        }
        return $collection;
    }
}
