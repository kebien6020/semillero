<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ArenasCamposAddAverageLength extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('arenas_campos', function (Blueprint $table) {
            $table->double('average_length')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('arenas_campos', function (Blueprint $table) {
            $table->dropColumn('average_length');
        });
    }
}
