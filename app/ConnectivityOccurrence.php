<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Well;
use App\ConnectivityMethod;

class ConnectivityOccurrence extends Model
{
    protected $fillable = [
        'start_date',
        'end_date',
        'event',
        'connectivity_method_id'
    ];

    protected $dates = [
        'start_date',
        'end_date'
    ];

    public function well()
    {
        return $this->belongsTo(Well::class);
    }

    public function connectivityMethod()
    {
        return $this->belongsTo(ConnectivityMethod::class);
    }
}
