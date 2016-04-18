<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFluidosCamposFluidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fluidos_campos_fluidos', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('campo_id');
            $table->integer('fluido_id');
            $table->decimal('percentage',13,12);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('fluidos_campos_fluidos');
    }
}
