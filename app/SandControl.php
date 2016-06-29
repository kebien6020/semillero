<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SandControl extends Model
{
    protected $fillable = 
    [
        'install_date',
        'event',
        'mechanism',
        'completion_type',
        'mesh_type',
        'gravel_size',
        'grade',
        'joints',
        'diameter',
        'internal_diameter',
        'clearance',
        'top',
        'length',
        'bottom',
        'weight',
        'slots_per_feet',
        'slot_width',
        'mesh',
        'slot_gauge',
        'ideal_size',
        'group',
    ];

    public function well()
    {
        return $this->belongsTo('App\Well');
    }

    //protected $dates = ['created_at', 'updated_at', 'install_date'];
}
