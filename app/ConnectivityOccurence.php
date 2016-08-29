<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Well;

class ConnectivityOccurrence extends Model
{
    protected $fillable = [
        'start_date',
        'end_date',
        'method'
    ];

    protected $dates = [
        'start_date',
        'end_date'
    ];

    public function well()
    {
        return $this->belongsTo(Well::class);
    }
}
