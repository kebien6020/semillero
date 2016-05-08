<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSandControlRecommendationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sand_control_recommendations', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('recommended_mechanism');
            $table->string('recommended_us_mesh')->nullable();

            $table->integer('sand_control_summary_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sand_control_recommendations');
    }
}
