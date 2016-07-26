<?php

namespace App;

use App\Well;
use Illuminate\Database\Eloquent\Model;

class AlsOccurrence extends Model
{
    protected $fillable = [
        'start_date',
        'end_date',
        'als',
        'event',
        'reason',
        'main_goal',
    ];

    public function well()
    {
        return $this->belongsTo(Well::class);
    }
}
