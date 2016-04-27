<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ArenasMuestrasTablasSeeder::class);
        //$this->call(ArenasMapSeeder::class);
        $this->call(FluidosCamposSeeder::class);
        $this->call(UsersSeeder::class);
    }
}
