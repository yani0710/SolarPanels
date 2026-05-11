<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedSystem extends Model
{
    use HasFactory;

    protected $table = 'saved_systems';

    protected $fillable = [
        'user_id',
        'title',
        'input_snapshot',
        'result_snapshot',
        'recommended_power_kwp',
        'recommended_battery_kwh',
        'system_type',
        'advice',
    ];

    protected $casts = [
        'recommended_power_kwp' => 'float',
        'recommended_battery_kwh' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
