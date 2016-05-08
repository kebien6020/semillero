<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    protected $fillable = ['name', 'vicepresidency'];

    public function basin()
    {
        return $this->belongsTo('App\Basin');
    }

    public function wells()
    {
        return $this->hasMany('App\Well');
    }

    public function sandControlSummaries()
    {
        return $this->hasOne('App\SandControlSummary');
    }
}
