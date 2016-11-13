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

    public function valueFunctionDataPoints()
    {
        return $this->hasMany(ValueFunctionDataPoint::class);
    }

    public function valueFunctionsObject()
    {
        return $this->valueFunctionDataPoints
            ->groupBy('alternative_id')
            ->map(function ($dataPoints, $key) {
                return collect([
                    'id' => $key,
                    'data' => $dataPoints->map(function ($dataPoint) {
                        return [$dataPoint->value, (string) $dataPoint->score];
                    }),
                ]);
            })
            ->values();
    }
}
