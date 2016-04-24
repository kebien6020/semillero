<?php

use Illuminate\Database\Seeder;

class ArenasMapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('arenas_cuencas')->delete();
        DB::table('arenas_campos')->delete();
        DB::table('arenas_pozos')->delete();

        // Seed Cuencas
        $llo = App\ArenasCuenca::create(['name' => 'Llanos Orientales']);

        // Seed Campos
        $apiay = $llo->campos()->save(
            new App\ArenasCampo([
                'name' => 'APIAY',
                'vicepresidency' => 'VRO',
            ])
        );

        $cano_sur = $llo->campos()->save(
            new App\ArenasCampo([
                'name' => 'CAÑO SUR',
                'vicepresidency' => 'VEX',
            ])
        );

        // Seed Pozos
        $apiay->pozos()->saveMany([
            new App\ArenasPozo([
                'name' => 'APIAY 17H',
                'start_date' => '2000-12-10',
                'end_date' => '2001-02-17',
                'event' => 'ODR',
                'longitude' => -74.58470058,
                'latitude' => 5.293864624,
            ]),
            new App\ArenasPozo([
                'name' => 'APIAY 33H',
                'start_date' => '2011-03-06',
                'end_date' => '2011-11-09',
                'event' => 'ODR',
                'longitude' => -74.59531739,
                'latitude' => 5.259458843,
            ]),
            new App\ArenasPozo([
                'name' => 'APIAY 37H',
                'start_date' => '2013-07-22',
                'end_date' => '2013-09-02',
                'event' => 'ODR',
                'longitude' => -74.5841102,
                'latitude' => 5.289384151,
            ]),
            new App\ArenasPozo([
                'name' => 'APIAY 43H',
                'start_date' => '2012-08-21',
                'end_date' => '2012-11-08',
                'event' => 'ODR',
                'longitude' => -74.58098439,
                'latitude' => 5.295235165,
            ]),
            new App\ArenasPozo([
                'name' => 'APIAY 45H',
                'start_date' => '2012-11-28',
                'end_date' => '2013-01-23',
                'event' => 'ODR',
                'longitude' => -74.60638878,
                'latitude' => 5.296910915,
            ])
        ]);

        $cano_sur->pozos()->saveMany([
            new App\ArenasPozo([
                'name' => 'EMBRUJO 1',
                'start_date' => '2011-10-19',
                'end_date' => '2011-11-22',
                'event' => 'OCM',
                'longitude' => -74.97283881,
                'latitude' => 3.748112555,
            ]),
            new App\ArenasPozo([
                'name' => 'MITO 1',
                'start_date' => '2011-05-08',
                'end_date' => '2011-05-18',
                'event' => 'OCM',
                'longitude' => -74.74015158,
                'latitude' => 3.712149494,
            ]),
            new App\ArenasPozo([
                'name' => 'MITO 2',
                'start_date' => '2013-03-14',
                'end_date' => '2013-04-04',
                'event' => 'OCM',
                'longitude' => -74.78290952,
                'latitude' => 3.686434492,
            ]),
            new App\ArenasPozo([
                'name' => 'PINOCHO 1',
                'start_date' => '2011-05-16',
                'end_date' => '2011-06-03',
                'event' => 'OCM',
                'longitude' => -74.74177758,
                'latitude' => 3.780789057,
            ])
        ]);

        // Seed SandControls
        $apiay->sandControls()->saveMany([
            new App\ArenasSandControl([
                'interval_depth' => '10254.92-10293.5',
                'uniformity_coefficient' => '5.89',
                'grain_size' => 281.13,
                'grain_size_range' => '251-500',
                'sand_type' => 'Arena media',
                'sand_uniformity' => 'Altamente no uniforme',
                'installed_mechanism' => 'Liner Ranurado',
                'installed_groove_thickness' => 0.02,
                'installed_gravel_size' => null,
                'installed_gravel_us' => null,
                'recommended_mechanism' => 'Empaque con Grava y Malla',
                'recommended_groove_thickness' => 0.033,
                'recommended_gravel_size' => 0.066,
                'recommended_gravel_us' => '10/20',
                'alternative_mechanism' => 'Liner Ranurado',
                'alternative_groove_thickness' => 0.022,
                'alternative_gravel_size' => null,
                'alternative_gravel_us' => null,
            ])
        ]);
    }
}
