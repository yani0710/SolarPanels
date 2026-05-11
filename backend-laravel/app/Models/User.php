<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function customAppliances()
    {
        return $this->hasMany(CustomAppliance::class, 'user_id');
    }

    public function savedSystems()
    {
        return $this->hasMany(SavedSystem::class, 'user_id');
    }

    public function assistantUsage()
    {
        return $this->hasMany(AssistantUsage::class, 'user_id');
    }

    public function assistantMessages()
    {
        return $this->hasMany(AssistantMessage::class, 'user_id');
    }
}
