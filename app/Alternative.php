<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\ValueFunctionDataPoint;

class Alternative extends Model
{
    protected $fillable = [
        'name',
        'new_tech'
    ];

    public function valueFunctionDataPoints()
    {
        return $this->hasMany(ValueFunctionDataPoint::class);
    }
}
