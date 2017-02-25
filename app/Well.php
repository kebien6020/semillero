<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\AlsOccurrence;
use App\ConnectivityOccurrence;
use App\MultipleOccurrence;
use App\PipeOccurrence;

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

    public function lastConnectivityOccurrence()
    {
        $occurrence = $this
            ->connectivityOccurrences()
            ->orderBy('start_date', 'DESC')
            ->get()
            ->first();
        return $occurrence;
    }

    public function pipeOccurrence()
    {
        return $this->hasOne(PipeOccurrence::class);
    }
}
