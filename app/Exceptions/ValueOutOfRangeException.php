<?php

namespace App\Exceptions;

use Exception;

class ValueOutOfRangeException extends Exception
{
    public function __construct($val, $name, $min, $max)
    {
        parent::__construct("Value for " . $name . " out of range: " . $val);

        $this->value = $val;
        $this->under = (bool)($val < $min);
        $this->min = $min;
        $this->max = $max;
    }

    public function __toString()
    {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }

    public $value;
    public $under;
    public $min;
    public $max;
}
