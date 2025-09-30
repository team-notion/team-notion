<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('model');
            $table->string('type');
            $table->year('year_of_manufacture');
            $table->decimal('daily_price', 10, 2);
            $table->json('photos');
            $table->json('availability_dates')->nullable();
            $table->text('rental_rules')->nullable();
            $table->decimal('deposit', 10, 2)->nullable();
            $table->boolean('deposit_percentage')->default(false);
            $table->integer('cutoff_hours')->default(24);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
