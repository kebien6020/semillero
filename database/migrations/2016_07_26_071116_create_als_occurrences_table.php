<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlsOccurrencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('als_occurrences', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->date('start_date');
            $table->date('end_date');
            $table->string('event');
            $table->string('als')->nullable();
            $table->string('reason')->nullable();
            $table->string('main_goal')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('als_occurrences');
    }
}
