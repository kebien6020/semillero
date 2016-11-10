<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    protected $fillable = ['name', 'vicepresidency', 'longitude', 'latitude'];

    public function basin()
    {
        return $this->belongsTo('App\Basin');
    }

    public function wells()
    {
        return $this->hasMany('App\Well');
    }

    public function sandControlSummary()
    {
        return $this->hasOne('App\SandControlSummary');
    }

    public function fluidDistribution()
    {
        $fluidOccurrences = $this->wells->pluck('fluidOccurrence')->flatten();
        $fluid_ids = $fluidOccurrences->unique('fluid_id')->pluck('fluid_id');
        $res = [];
        foreach ($fluid_ids as $fluid_id) {
            $fluid = Fluid::find($fluid_id);
            $res[] = [
                'id' => $fluid->id,
                'name' => $fluid->name,
                'color' => $fluid->color,
                'occurrences' => $fluidOccurrences->where('fluid_id', $fluid_id)->count(),
            ];
        }
        return $res;
    }

    public function connectivityDistribution()
    {
        $this->load('wells.connectivityOccurrences');
        $connectivityOccurrences = $this->wells->pluck('connectivityOccurrences')->flatten();
        $methods_ids = $connectivityOccurrences->unique('connectivity_method_id')->pluck('connectivity_method_id');
        $res = [];
        $count = 0;
        foreach ($methods_ids as $method_id) {
            $method = ConnectivityMethod::find($method_id);
            $occurrences = $connectivityOccurrences->where('connectivity_method_id', $method_id)->count();
            $res[] = (object)[
                'id' => $method->id,
                'name' => $method->name,
                'color' => $method->color,
                'occurrences' => $occurrences,
            ];
            $count += $occurrences;
        }
        return (object)[
            'distribution' => $res,
            'count' => $count
        ];
    }
}
