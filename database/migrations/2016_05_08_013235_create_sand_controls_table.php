<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSandControlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sand_controls', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->string('install_date');
            $table->string('event');
            $table->string('mechanism');
            $table->string('completion_type')->nullable();
            $table->string('mesh_type')->nullable;
            $table->string('gravel_size')->nullable;
            $table->string('grade')->nullable();
            $table->integer('joints')->nullable();
            $table->double('diameter')->nullable();
            $table->double('internal_diameter')->nullable();
            $table->double('clearance')->nullable();
            $table->double('top')->nullable();
            $table->double('length')->nullable();
            $table->double('bottom')->nullable();
            $table->double('weight')->nullable();
            $table->integer('slots_per_feet')->nullable();
            $table->double('slot_width')->nullable();
            $table->double('mesh')->nullable();
            $table->double('slot_gauge')->nullable();
            $table->double('ideal_size')->nullable();

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
        Schema::drop('sand_controls');
    }
}
