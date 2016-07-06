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

    public function stats(){
        //Query samples
        $samples = $this->samples()->orderBy('grain_size')->get();

        //Average
        $frequency_sum = 0;
        $value_sum = 0;
        foreach ($samples as $sample) {
            $frequency_sum += $sample->frequency;
            $value_sum += ($sample->grain_size) * ($sample->frequency);
        }
        $average = $value_sum / $frequency_sum;

        // Relative Frequency - Data for plotting
        $rel_frequency = [];    //relative_frequency
        $cummulative_rel_frequency = [];
        $plot_data = [];

        for ($i=0; $i < count($samples); $i++) { 
            $sample = $samples[$i];
            $rel_frequency[$i] = $sample->frequency / $frequency_sum *100;

            $cummulative_rel_frequency[$i] = $rel_frequency[$i];
            if ($i > 0) {
                $cummulative_rel_frequency[$i] += $cummulative_rel_frequency[$i-1];
            }

            $plot_data[$i][0] = $sample->grain_size;
            $plot_data[$i][1] = $cummulative_rel_frequency[$i];
        }
        return ['average' => $average, 'plot_data' => $plot_data];
    }

    public function delete()
    {
        $this->samples()->delete();
        return parent::delete();
    }
}
