<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSandControlSummariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sand_control_summaries', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('interval_avg_len');
            $table->string('uniformity');
            $table->double('avg_grain_size');
            $table->double('grain_size_range');
            $table->string('type');
            $table->string('uniformity_txt');
            $table->string('installed_mechanism');
            $table->double('installed_groove_size')->nullable();
            $table->double('installed_grain_size')->nullable();
            $table->string('installed_us_mesh')->nullable();
            $table->text('remarks')->nullable();

            $table->integer('field_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sand_control_summaries');
    }
}
