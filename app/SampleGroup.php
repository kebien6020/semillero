<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SampleGroup extends Model
{
    protected $fillable = ['name'];

    public function samples()
    {
        return $this->hasMany('App\Sample');
    }

    public function orderedSamples()
    {
        return $this->samples()->orderBy('grain_size')->get();
    }

    public function getAverage()
    {
        $samples = $this->orderedSamples();

        //Average
        $frequency_sum = 0;
        $value_sum = 0;
        foreach ($samples as $sample) {
            $frequency_sum += $sample->frequency;
            $value_sum += ($sample->grain_size) * ($sample->frequency);
        }
        $average = $value_sum / $frequency_sum;

        return $average;
    }

    public function getPlotData()
    {
        $samples = $this->orderedSamples();

        // Relative Frequency - Data for plotting
        $rel_frequency = [];    //relative_frequency
        $cummulative_rel_frequency = [];
        $points = [];
        $frequency_sum = $this->samples()->sum('frequency');

        // Calculate relative frecuency for each grain_size
        for ($i=0; $i < count($samples); $i++) { 
            $sample = $samples[$i];
            $rel_frequency[$i] = $sample->frequency / $frequency_sum *100;

            $cummulative_rel_frequency[$i] = $rel_frequency[$i];
            if ($i > 0) {
                $cummulative_rel_frequency[$i] += $cummulative_rel_frequency[$i-1];
            }
            $points[$i] = (object)[];
            $points[$i]->grain_size = $sample->grain_size;
            $points[$i]->cummulative_rel_freq = $cummulative_rel_frequency[$i];
        }

        // Interpolations
        $x10 = self::interpolate_y(10, $points);
        $x60 = self::interpolate_y(60, $points);
        $x90 = self::interpolate_y(90, $points);
        $x50 = self::interpolate_y(50, $points);
        $x30 = self::interpolate_y(30, $points);

        return (object)[
            'points' => $points,
            'x10' => $x10,
            'x60' => $x60,
            'x90' => $x90,
            'x50' => $x50,
            'x30' => $x30,
        ];
    }

    // Utility functions for interpolation

    // Get values for interpolation
    private static function valuesAround($value, $arr)
    {
        // We can't interpolate with less than 2 points
        if (count($arr) <= 1) return null;
        // When the value is too small, interpolate with the first 2 points
        else if ($value < $arr[0]->cummulative_rel_freq)
            return [$arr[0],$arr[1]];
        // When it's too big, interpolate with the last 2 points. This shouldn't happen
        else if ($value > $arr[count($arr)-1]->cummulative_rel_freq)
            return [$arr[count($arr)-2], $arr[count(arr)-1]];
        $i = 0;
        do {
            $point1 = $arr[$i];
            $point2 = $arr[$i+1];

            $i++;
        } while (!($point1->cummulative_rel_freq <= $value and $point2->cummulative_rel_freq > $value));
        return [$point1, $point2];
    }

    private static function interpolate_y_between($value, $points)
    {
        $x1 = $points[0]->grain_size;
        $x2 = $points[1]->grain_size;
        $y1 = $points[0]->cummulative_rel_freq;
        $y2 = $points[1]->cummulative_rel_freq;
        if ($y1 == $y2) return $y1;
        return pow(10,(log10($x2) - log10($x1))/($y2 - $y1)*($value - $y1) + log10($x1));
    }

    private static function interpolate_y($value, $arr)
    {
        return self::interpolate_y_between($value, self::valuesAround($value,$arr));
    }

    // End of utility functions

    public function delete()
    {
        $this->samples()->delete();
        return parent::delete();
    }
}
