<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Fluid extends Model
{
    protected $fillable = ['name', 'color'];

    public function fluidOccurrences()
    {
        return $this->hasMany('App\FluidOccurrence');
    }

    public function densityRanges()
    {
        return $this->hasMany('App\DensityRange');
    }
}
