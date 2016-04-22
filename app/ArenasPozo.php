<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasPozo extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date', 'event', 'longitude', 'latitude'];

    public function arenas_campo(){
        return $this->belongsTo('App\ArenasCampo');
    }
}
