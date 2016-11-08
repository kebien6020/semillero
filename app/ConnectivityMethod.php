<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\ConnectivityOccurrence;

class ConnectivityMethod extends Model
{
    protected $fillable = [
        'name',
        'color'
    ];

    public function connectivityOccurrences()
    {
        return $this->hasMany(ConnectivityOccurrence::class);
    }
}
