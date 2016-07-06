<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sample extends Model
{
    protected $fillable = ['grain_size', 'frequency'];

    public function sampleGroup()
    {
        return $this->belongsTo('App\SampleGroup');
    }
}
