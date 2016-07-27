<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddWellIdToAlsOccurrences extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('als_occurrences', function (Blueprint $table) {
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
        Schema::table('als_occurrences', function (Blueprint $table) {
            $table->dropColumn('well_id');
        });
    }
}
