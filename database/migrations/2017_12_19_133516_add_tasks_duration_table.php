<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTasksDurationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks_duration', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('task_id');
            $table->boolean('active')->nullable();
            $table->string('startTime');
            $table->string('spendTime')->nullable();
            $table->string('endTime')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks_duration');
    }
}
