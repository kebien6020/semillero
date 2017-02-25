<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePipeOccurrencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pipe_occurrences', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->integer('year')->nullable();
            $table->string('type')->nullable();
            $table->string('corrosion')->nullable();

            $table->integer('well_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('pipe_occurrences');
    }
}
