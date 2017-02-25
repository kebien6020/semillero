<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Well;

class PipeOccurrence extends Model
{
    protected $fillable = [
        'year',
        'type',
        'corrosion'
    ];

    public function well()
    {
        return $this->belongsTo(Well::class);
    }
}
