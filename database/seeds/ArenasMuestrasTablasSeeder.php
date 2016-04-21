<?php

use Illuminate\Database\Seeder;

class ArenasMuestrasTablasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('arenas_muestras')->delete();
        DB::table('arenas_muestras_tablas')->delete();

        // Manually seed the same sample data provided with the algorithm
        $table = App\ArenasMuestrasTabla::create([
            'name' => 'Datos para la muestra de interes']);
        $table->samples()->saveMany([
            new App\ArenasMuestras(['grain_size' => 5, 'frequency' => 5]),
            new App\ArenasMuestras(['grain_size' => 10, 'frequency' => 10]),
            new App\ArenasMuestras(['grain_size' => 15, 'frequency' => 20]),
            new App\ArenasMuestras(['grain_size' => 20, 'frequency' => 30]),
            new App\ArenasMuestras(['grain_size' => 30, 'frequency' => 45]),
            new App\ArenasMuestras(['grain_size' => 40, 'frequency' => 60]),
            new App\ArenasMuestras(['grain_size' => 50, 'frequency' => 80]),
            new App\ArenasMuestras(['grain_size' => 270, 'frequency' => 34]),
            new App\ArenasMuestras(['grain_size' => 300, 'frequency' => 56]),
            new App\ArenasMuestras(['grain_size' => 350, 'frequency' => 67]),
            new App\ArenasMuestras(['grain_size' => 400, 'frequency' => 90]),
            new App\ArenasMuestras(['grain_size' => 500, 'frequency' => 234]),
            new App\ArenasMuestras(['grain_size' => 600, 'frequency' => 300]),
            new App\ArenasMuestras(['grain_size' => 1000, 'frequency' => 24]),
        ]);

        factory(App\ArenasMuestrasTabla::class, 10)->create()->each(function ($table){
            $table->samples()->saveMany(factory(App\ArenasMuestras::class, 30)->make());
        });
    }
}
