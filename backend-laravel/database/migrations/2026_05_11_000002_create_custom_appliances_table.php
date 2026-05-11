<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('custom_appliances', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('category');
            $table->float('count')->default(1);
            $table->float('wattage');
            $table->float('hours_per_day');
            $table->float('days_per_month');
            $table->string('usage_time');
            $table->boolean('is_critical')->default(false);
            $table->string('seasonality')->default('year-round');
            $table->boolean('high_start_load')->default(false);
            $table->string('certainty')->default('approximate');
            $table->string('work_pattern')->default('daily');
            $table->string('note')->default('');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_appliances');
    }
};
