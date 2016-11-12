<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateValueFunctionDataPointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('value_function_data_points', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('value');
            $table->double('score');

            $table->integer('alternative_id');
            $table->integer('criterion_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('value_function_data_points');
    }
}
