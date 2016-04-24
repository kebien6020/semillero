<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArenasSandControlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('arenas_sand_controls', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('interval_depth');
            $table->string('uniformity_coefficient');
            $table->double('grain_size');
            $table->string('grain_size_range');
            $table->string('sand_type');
            $table->string('sand_uniformity');
            $table->string('installed_mechanism')->nullable();
            $table->double('installed_groove_thickness')->nullable();
            $table->double('installed_gravel_size')->nullable();
            $table->string('installed_gravel_us')->nullable();
            $table->string('recommended_mechanism')->nullable();
            $table->double('recommended_groove_thickness')->nullable();
            $table->double('recommended_gravel_size')->nullable();
            $table->string('recommended_gravel_us')->nullable();
            $table->string('alternative_mechanism')->nullable();
            $table->double('alternative_groove_thickness')->nullable();
            $table->double('alternative_gravel_size')->nullable();
            $table->string('alternative_gravel_us')->nullable();

            $table->integer('arenas_campo_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('arenas_sand_controls');
    }
}
