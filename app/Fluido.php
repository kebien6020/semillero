<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Fluido extends Model
{
    protected $table = 'fluidos_completamiento';

    protected $fillable = ['name', 'color'];

    public function campos(){
        return $this
            ->belongsToMany(
                'App\FluidosCampo', 'fluidos_campos_fluidos',
                'campo_id', 'fluido_id')
            ->withPivot('percentage')
            ->withTimestamps();
    }

}
