<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SandControlSummary extends Model
{
    protected $fillable = [
        'interval_avg_len',
        'uniformity',
        'avg_grain_size',
        'grain_size_range',
        'type',
        'uniformity_txt',
        'installed_mechanism',
        'installed_groove_size',
        'installed_grain_size',
        'installed_us_mesh',
        'remarks',
    ];

    public function field()
    {
        return $this->belongsTo('App\Field');
    }

    public function sandControlRecommendations()
    {
        return $this->hasMany('App\SandControlRecommendation');
    }
}
