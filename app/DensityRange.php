<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DensityRange extends Model
{
    protected $fillable = ['min', 'max'];

    public function fluid()
    {
        return $this->belongsTo('App\Fluid');
    }
}
