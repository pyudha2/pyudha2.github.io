<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SocialLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'icon',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    // Social platforms from the design
    const PLATFORMS = [
        'GitHub' => ['icon' => '🐙', 'color' => '#333'],
        'LinkedIn' => ['icon' => '💼', 'color' => '#0077b5'],
        'Twitter' => ['icon' => '🐦', 'color' => '#1da1f2'],
        'Email' => ['icon' => '📧', 'color' => '#ea4335'],
    ];

    // Scopes
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    // Accessors
    public function getIsExternalAttribute()
    {
        return !str_starts_with($this->url, 'mailto:');
    }

    public function getTargetAttribute()
    {
        return $this->is_external ? '_blank' : '_self';
    }

    public function getRelAttribute()
    {
        return $this->is_external ? 'noopener noreferrer' : null;
    }

    // Static methods
    public static function getActive()
    {
        return self::active()->ordered()->get();
    }
}
