<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FluidosCampo extends Model
{
    protected $fillable = ['name', 'number_wells'];

    public function fluidos(){
        return $this
            ->belongsToMany(
                'App\Fluido','fluidos_campos_fluidos',
                'fluido_id', 'campo_id')
            ->withPivot('percentage')
            ->withTimestamps();
    }
}
