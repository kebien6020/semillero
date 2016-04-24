<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArenasSandControl extends Model
{
    protected $fillable = [
        'interval_depth',
        'uniformity_coefficient',
        'grain_size',
        'grain_size_range',
        'sand_type',
        'sand_uniformity',
        'installed_mechanism',
        'installed_groove_thickness',
        'installed_gravel_size',
        'installed_gravel_us',
        'recommended_mechanism',
        'recommended_groove_thickness',
        'recommended_gravel_size',
        'recommended_gravel_us',
        'alternative_mechanism',
        'alternative_groove_thickness',
        'alternative_gravel_size',
        'alternative_gravel_us',
    ];

    public function campo(){
        return $this->belongsTo('App\ArenasCampo');
    }
}
