<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssistantUsage extends Model
{
    use HasFactory;

    protected $table = 'assistant_usage';

    protected $fillable = [
        'user_id',
        'guest_id',
        'day_key',
        'question_count',
    ];

    protected $casts = [
        'question_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
