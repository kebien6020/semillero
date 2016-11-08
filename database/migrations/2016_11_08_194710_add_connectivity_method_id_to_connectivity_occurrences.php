<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddConnectivityMethodIdToConnectivityOccurrences extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('connectivity_occurrences', function (Blueprint $table) {
            $table->dropColumn('method');
            $table->integer('connectivity_method_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('connectivity_occurrences', function (Blueprint $table) {
            $table->dropColumn('connectivity_method_id');
            $table->string('method');
        });
    }
}
