<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\MultipleOccurrence;

class Completion extends Model
{
    protected $fillable = [
        'name',
        'color',
    ];

    public function multipleOccurrences()
    {
        return $this->hasMany(MultipleOccurrence::class);
    }
}
