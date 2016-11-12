<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\ValueFunctionDataPoint;

class Criterion extends Model
{
    protected $fillable = [
        'name',
        'type',
        'weight'
    ];

    public function valueFunctionDataPoint()
    {
        return $this->hasMany(ValueFunctionDataPoint::class);
    }
}
