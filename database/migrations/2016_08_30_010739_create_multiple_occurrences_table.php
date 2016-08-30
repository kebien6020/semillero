<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMultipleOccurrencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('multiple_occurrences', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();

            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('reason');
            $table->string('type');
            $table->string('event');

            $table->integer('well_id');
            $table->integer('completion_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('multiple_occurrences');
    }
}
