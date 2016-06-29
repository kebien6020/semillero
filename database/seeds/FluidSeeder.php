<?php

use Illuminate\Database\Seeder;

use App\Basin;
use App\Field;
use App\Well;
use App\Fluid;
use App\FluidOccurrence;
use App\DensityRange;
use Carbon\Carbon;

class FluidSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear tables
        DB::table('fluids')->delete();
        DB::table('fluid_occurrences')->delete();
        DB::table('density_ranges')->delete();

        // Fluid
        $fm_na = Fluid::create([
            'name' => 'Formiato de Sodio',
            'color' => '#00F',
        ]);

        // FluidOccurrence
        $lla = Basin::firstOrNew(['name' => 'Llanos Orientales']);
        $lla->save();

        $aka = Field::firstOrNew(['name' => 'AKACIAS']);
        $aka->vicepresidency = 'VRO';
        $lla->fields()->save($aka);
        
        $aka10 = Well::firstOrNew(['name' => 'AKACIAS 10']);
        $aka10->town = 'ACACIAS';
        $aka10->longitude = -73.720007546;
        $aka10->latitude = 3.95213065666;
        $aka->wells()->save($aka10);

        $occurrence = FluidOccurrence::firstOrNew([
            'event' => 'OCM',
            'start_date' => Carbon::create(2013, 5, 8, 0, 0, 0),
        ]);
        $occurrence->density = 8.6;
        $occurrence->fluid_id = $fm_na->id;
        $aka10->fluidOccurrence()->save($occurrence);


        // Density Ranges
        $fm_na->densityRanges()->saveMany([
            new DensityRange(['min' => 8.4, 'max' => 8.95]),
            new DensityRange(['min' => 8.95, 'max' => 9.50]),
            new DensityRange(['min' => 9.50, 'max' => 10.04]),
            new DensityRange(['min' => 10.04, 'max' => 10.6]),
            new DensityRange(['min' => 10.6, 'max' => 11.1]),
        ]);
    }
}
