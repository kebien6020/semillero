<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasMuestrasTabla extends Model
{
    protected $fillable = ['name'];

    public function samples(){
        return $this->hasMany('App\ArenasMuestras','name_id');
    }
}
