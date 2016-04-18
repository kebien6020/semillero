<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasMuestras extends Model
{
    protected $fillable = ['grain_size', 'frecuency', 'name_id'];

    protected $table = 'arenas_muestras';

    public function table(){
        return $this->belongsTo('App\ArenasMuestrasTabla');
    }
}
