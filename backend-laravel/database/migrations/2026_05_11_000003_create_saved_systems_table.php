<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('saved_systems', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->longText('input_snapshot');
            $table->longText('result_snapshot');
            $table->float('recommended_power_kwp');
            $table->float('recommended_battery_kwh');
            $table->string('system_type');
            $table->longText('advice');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_systems');
    }
};
