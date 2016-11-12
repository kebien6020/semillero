<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Alternative;
use App\Criterion;

class ValueFunctionDataPoint extends Model
{
    protected $fillable = [
        'value',
        'score'
    ];

    public function alternative()
    {
        return $this->belongsTo(Alternative::class);
    }

    public function criterion()
    {
        return $this->belongsTo(Criterion::class);
    }
}
