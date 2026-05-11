<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomAppliance extends Model
{
    use HasFactory;

    protected $table = 'custom_appliances';

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'count',
        'wattage',
        'hours_per_day',
        'days_per_month',
        'usage_time',
        'is_critical',
        'seasonality',
        'high_start_load',
        'certainty',
        'work_pattern',
        'note',
    ];

    protected $casts = [
        'count' => 'float',
        'wattage' => 'float',
        'hours_per_day' => 'float',
        'days_per_month' => 'float',
        'is_critical' => 'bool',
        'high_start_load' => 'bool',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
