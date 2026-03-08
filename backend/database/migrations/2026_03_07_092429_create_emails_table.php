<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('emails', function (Blueprint $table) {

        $table->id();

        $table->string('gmail_id');
        $table->string('thread_id');

        $table->string('sender');
        $table->string('receiver');

        $table->string('subject')->nullable();

        $table->longText('body');

        $table->timestamps();

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emails');
    }
};
