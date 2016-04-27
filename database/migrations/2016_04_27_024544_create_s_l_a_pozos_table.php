<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSLAPozosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('s_l_a_pozos', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('sla')->nullable();
            $table->string('event');
            $table->string('field')->nullable();
            $table->string('name');
            $table->string('east')->nullable();
            $table->string('north')->nullable();
            $table->double('longitude')->nullable();
            $table->double('latitude')->nullable();
            $table->string('department')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('s_l_a_pozos');
    }
}
