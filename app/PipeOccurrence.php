<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Well;
use DB;

class PipeOccurrence extends Model
{
    protected $fillable = [
        'year',
        'type',
        'corrosion'
    ];

    public function well()
    {
        return $this->belongsTo(Well::class);
    }

    public static function countOccurrences($field, $relationship = null, $rId = null)
    {
        $valid = $relationship !== 'well'
                 || $relationship !== 'field'
                 || $relationship !== 'basin'
                 || $relationship !== null;
        if (!$valid) {
            throw new \Exception('Invalid Relationship Param', 1);
        }
        $q = static::getQuery()
            ->select($field)
            ->addSelect(DB::raw('count(distinct `pipe_occurrences`.`id`) as `occurrences`'));
        switch ($relationship) {
            case 'basin':
                $q->join('wells', 'pipe_occurrences.well_id', '=', 'wells.id');
                $q->join('fields', 'wells.field_id', '=', 'fields.id');
                $q->join('basins', 'fields.basin_id', '=', 'basins.id');
                break;
            case 'field':
                $q->join('wells', 'pipe_occurrences.well_id', '=', 'wells.id');
                $q->join('fields', 'wells.field_id', '=', 'fields.id');
                break;
            case 'well':
                $q->join('wells', 'pipe_occurrences.well_id', '=', 'wells.id');
                break;
        }
        if ($relationship !== null) {
            $q->where("${relationship}s.id", '=', $rId);
            $q->groupBy("pipe_occurrences.${field}");
        }
        $dataPoints = collect($q->get())
            ->map(function ($d) use ($field) {
                return collect([$d->{$field}, $d->occurrences]);
            });
        return $dataPoints;
    }
}
