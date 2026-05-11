<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssistantMessage extends Model
{
    use HasFactory;

    protected $table = 'assistant_messages';

    protected $fillable = [
        'user_id',
        'guest_id',
        'role',
        'content',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
