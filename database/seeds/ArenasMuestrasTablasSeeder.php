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
        factory(App\ArenasMuestrasTabla::class, 3)->create()->each(function ($table){
            $table->samples()->saveMany(factory(App\ArenasMuestras::class, 30)->make());
        });
    }
}
