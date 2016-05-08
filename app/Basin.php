<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Basin extends Model
{
    protected $fillable = ['name'];

    public function fields()
    {
        return $this->hasMany('App\Field');
    }
}
