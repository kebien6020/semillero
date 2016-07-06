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
}
