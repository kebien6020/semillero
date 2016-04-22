<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasCampo extends Model
{
    protected $fillable = ['name', 'vicepresidency', 'average_length'];

    public function pozos(){
        return $this->hasMany('App\ArenasPozo');
    }
}
