<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasCuenca extends Model
{
    protected $fillable = ['name'];

    public function campos(){
        return $this->hasMany('App\ArenasCampo');
    }
}
