<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('assistant_usage', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('guest_id')->nullable();
            $table->string('day_key');
            $table->integer('question_count')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'day_key']);
            $table->unique(['guest_id', 'day_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistant_usage');
    }
};
