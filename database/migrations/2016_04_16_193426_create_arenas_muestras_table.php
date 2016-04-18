<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArenasMuestrasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('arenas_muestras', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('name_id');

            $table->double('grain_size');
            $table->integer('frecuency');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('arenas_muestras');
    }
}
