<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasPozo extends Model
{
    protected $fillable = [
        'name',
        'install_date',
        'event',
        'mechanism',
        'completion_type',
        'mesh_type',
        'gravel_us',
        'grade',
        'joints',
        'diameter',
        'internal_diameter',
        'clearance',
        'top',
        'length',
        'bottom',
        'weight',
        'north',
        'east',
        'town',
        'slots_per_ft',
        'slot_width',
        'mesh',
        'slot_gauge',
        'ideal_size',
        'longitude',
        'latitude',
    ];

    protected $dates = ['install_date'];

    public function arenas_campo(){
        return $this->belongsTo('App\ArenasCampo');
    }
}
