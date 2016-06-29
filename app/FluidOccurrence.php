<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FluidOccurrence extends Model
{
    protected $fillable = ['event', 'start_date', 'density', 'fluid_id'];

    public function well()
    {
        return $this->belongsTo('App\Well');
    }

    public function fluid()
    {
        return $this->belongsTo('App\Fluid');
    }

    //protected $dates = ['created_at', 'updated_at', 'start_date'];
}
