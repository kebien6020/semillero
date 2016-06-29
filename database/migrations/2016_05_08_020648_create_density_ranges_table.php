<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDensityRangesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('density_ranges', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->double('min');
            $table->double('max');

            $table->integer('fluid_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('density_ranges');
    }
}
