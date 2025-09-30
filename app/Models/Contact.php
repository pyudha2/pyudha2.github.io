<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'project_type',
        'message',
        'status',
        'ip_address',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    // Status constants
    const STATUS_NEW = 'new';
    const STATUS_READ = 'read';
    const STATUS_REPLIED = 'replied';

    const STATUSES = [
        self::STATUS_NEW => 'New',
        self::STATUS_READ => 'Read',
        self::STATUS_REPLIED => 'Replied',
    ];

    // Scopes
    public function scopeNew(Builder $query)
    {
        return $query->where('status', self::STATUS_NEW);
    }

    public function scopeRead(Builder $query)
    {
        return $query->where('status', self::STATUS_READ);
    }

    public function scopeReplied(Builder $query)
    {
        return $query->where('status', self::STATUS_REPLIED);
    }

    public function scopeRecent(Builder $query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Accessors
    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? 'Unknown';
    }

    public function getIsNewAttribute()
    {
        return $this->status === self::STATUS_NEW;
    }

    public function getIsReadAttribute()
    {
        return $this->status === self::STATUS_READ;
    }

    public function getIsRepliedAttribute()
    {
        return $this->status === self::STATUS_REPLIED;
    }

    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('M d, Y \a\t H:i');
    }

    // Methods
    public function markAsRead()
    {
        $this->update([
            'status' => self::STATUS_READ,
            'read_at' => now(),
        ]);
    }

    public function markAsReplied()
    {
        $this->update([
            'status' => self::STATUS_REPLIED,
            'read_at' => $this->read_at ?? now(),
        ]);
    }
}
