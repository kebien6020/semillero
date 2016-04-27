<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ArenasPozosAddColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('arenas_pozos', function (Blueprint $table) {
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
            $table->dropColumn('event');
        });
        Schema::table('arenas_pozos', function (Blueprint $table) {
            $table->date('install_date')->nullable();

            $table->string('event')->nullable();

            $table->string('mechanism');
            $table->string('completion_type')->nullable();
            $table->string('mesh_type')->nullable();
            $table->string('gravel_us')->nullable();
            $table->string('grade')->nullable();
            $table->double('joints')->nullable();
            $table->double('diameter')->nullable();
            $table->double('internal_diameter')->nullable();
            $table->double('clearance')->nullable();
            $table->double('top')->nullable();
            $table->double('length')->nullable();
            $table->double('bottom')->nullable();
            $table->double('weight')->nullable();
            $table->double('north');
            $table->double('east');
            $table->string('town');
            $table->integer('slots_per_ft')->nullable();
            $table->double('slot_width')->nullable();
            $table->double('mesh')->nullable();
            $table->double('slot_gauge')->nullable();
            $table->double('ideal_size')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
        Schema::table('arenas_pozos', function (Blueprint $table) {
            $table->date('start_date');
            $table->date('end_date');
            $table->dropColumn('install_date');

            $table->dropColumn('mechanism');
            $table->dropColumn('completion_type');
            $table->dropColumn('mesh_type');
            $table->dropColumn('gravel_us');
            $table->dropColumn('grade');
            $table->dropColumn('joints');
            $table->dropColumn('diameter');
            $table->dropColumn('internal_diameter');
            $table->dropColumn('clearance');
            $table->dropColumn('top');
            $table->dropColumn('length');
            $table->dropColumn('bottom');
            $table->dropColumn('weight');
            $table->dropColumn('north');
            $table->dropColumn('east');
            $table->dropColumn('town');
            $table->dropColumn('slots_per_ft');
            $table->dropColumn('slot_width');
            $table->dropColumn('mesh');
            $table->dropColumn('slot_gauge');
            $table->dropColumn('ideal_size');
        });
    }
}
