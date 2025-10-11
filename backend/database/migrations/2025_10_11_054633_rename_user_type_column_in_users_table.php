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
        Schema::table('users', function (Blueprint $table) {
            // First drop the old foreign key constraint
            $table->dropForeign(['user_type']);

            // Then rename the column
            $table->renameColumn('user_type', 'user_type_id');

            // Recreate the foreign key constraint with the new column name
            $table->foreign('user_type_id')
                ->references('id')
                ->on('user_types')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the new foreign key
            $table->dropForeign(['user_type_id']);

            // Rename back
            $table->renameColumn('user_type_id', 'user_type');

            // Recreate original foreign key
            $table->foreign('user_type')
                ->references('id')
                ->on('user_types')
                ->onDelete('set null');
        });
    }
};
