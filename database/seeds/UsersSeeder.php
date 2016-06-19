<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();
        User::create([
            'name' => 'Administrador',
            'username' => 'admin',
            'is_admin' =>'true',
            'email' => 'admin@semillero.app',
            'password' => bcrypt('semillero123'),
        ]);
    }
}
