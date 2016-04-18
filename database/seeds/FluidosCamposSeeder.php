<?php

use Illuminate\Database\Seeder;
use App\Fluido;
use App\FluidosCampo;

class FluidosCamposSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('fluidos_completamiento')->delete();
        $formiato_na = Fluido::create([
            'name' => 'Formiato de Sodio',
            'color' => '#00F',
        ]);
        $kcl = Fluido::create([
            'name' => 'KCl',
            'color' => '#0F0',
        ]);
        $nacl = Fluido::create([
            'name' => 'NaCl',
            'color' => '#0FF',
        ]);
        $formiato_k = Fluido::create([
            'name' => 'Formiato de Potasio',
            'color' => '#93F',
        ]);

        DB::table('fluidos_campos')->delete();
        $petrolea = FluidosCampo::create([
            'name' => 'PETROLEA',
            'number_wells' => 11,
        ]);
        $sardinata = FluidosCampo::create([
            'name' => 'SARDINATA',
            'number_wells' => 5,
        ]);
        $tibu = FluidosCampo::create([
            'name' => 'TIBU',
            'number_wells' => 68,
        ]);

        DB::table('fluidos_campos_fluidos')->delete();
        $petrolea->fluidos()->attach($formiato_na->id,['percentage'=>0.18]);
        $petrolea->fluidos()->attach($kcl->id,['percentage' => 0.64]);
        $petrolea->fluidos()->attach($nacl->id,['percentage' => 0.18]);

        $sardinata->fluidos()->attach($formiato_na->id,['percentage' => 0.20]);
        $sardinata->fluidos()->attach($kcl->id,['percentage' => 0.20]);
        $sardinata->fluidos()->attach($formiato_k->id,['percentage' => 0.60]);

        $tibu->fluidos()->attach($formiato_na->id,['percentage' => 0.17]);
        $tibu->fluidos()->attach($kcl->id,['percentage' => 0.25]);
        $tibu->fluidos()->attach($nacl->id,['percentage' => 0.48]);
        $tibu->fluidos()->attach($formiato_k->id,['percentage' => 0.09]);

        
    }
}
