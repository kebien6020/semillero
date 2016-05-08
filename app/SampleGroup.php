<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SampleGroup extends Model
{
    protected $fillable = ['name'];

    public function samples()
    {
        return $this->hasMany('App\Sample');
    }
}
