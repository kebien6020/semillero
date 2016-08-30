<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\AlsOccurrence;
use App\ConnectivityOccurrence;
use App\MultipleOccurrence;

class Well extends Model
{
    protected $fillable = ['name', 'town', 'longitude', 'latitude'];

    public function field()
    {
        return $this->belongsTo('App\Field');
    }

    public function sandControls()
    {
        return $this->hasMany('App\SandControl');
    }

    public function fluidOccurrence()
    {
        return $this->hasOne('App\FluidOccurrence');
    }

    public function alsOccurrences()
    {
        return $this->hasMany(AlsOccurrence::class);
    }

    public function connectivityOccurrences()
    {
        return $this->hasMany(ConnectivityOccurrence::class);
    }

    public function multipleOccurrences()
    {
        return $this->hasMany(MultipleOccurrence::class);
    }
}
