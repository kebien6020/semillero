<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFluidOccurrencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fluid_occurrences', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('event');
            $table->string('start_date');
            $table->double('density')->nullable();

            $table->integer('well_id')->nullable();
            $table->integer('fluid_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('fluid_occurrences');
    }
}
