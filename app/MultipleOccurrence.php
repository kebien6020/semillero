<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Well;
use App\Completion;

class MultipleOccurrence extends Model
{
    protected $fillable = [
        'start_date',
        'end_date',
        'reason',
        'type',
        'event',
    ];

    protected $dates = [
        'start_date',
        'end_date',
    ];

    public function well()
    {
        return $this->belongsTo(Well::class);
    }

    public function completion()
    {
        return $this->belongsTo(Completion::class);
    }
}
