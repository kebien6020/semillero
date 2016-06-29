<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SandControlRecommendation extends Model
{
    protected $fillable = [
        'recommended_mechanism',
        'recommended_us_mesh',
    ];

    public function sandControlSummary()
    {
        return $this->belongsTo('App\SandControlSummary');
    }
}
