<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SLAPozo extends Model
{
    protected $fillable = [
        'start_date',
        'end_date',
        'sla',
        'event',
        'field',
        'name',
        'east', // Magna 3116
        'north',
        'longitude', // WGS84
        'latitude',
        'department',
    ];
}
