<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'emoji',
        'image',
        'live_url',
        'demo_url',
        'github_url',
        'case_study_url',
        'app_store_url',
        'order',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });

        static::updating(function ($project) {
            if ($project->isDirty('title') && empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    // Relationships
    public function techStacks()
    {
        return $this->belongsToMany(TechStack::class, 'project_tech_stack')
            ->orderBy('order');
    }

    // Scopes
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy('order')->orderBy('created_at', 'desc');
    }

    // Accessors
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/projects/' . $this->image);
        }
        return null;
    }

    public function getHasLinksAttribute()
    {
        return !empty($this->live_url) ||
            !empty($this->demo_url) ||
            !empty($this->github_url) ||
            !empty($this->case_study_url) ||
            !empty($this->app_store_url);
    }

    public function getLinksAttribute()
    {
        $links = [];

        if ($this->live_url) {
            $links[] = ['type' => 'live', 'url' => $this->live_url, 'text' => 'Live Demo'];
        }

        if ($this->demo_url) {
            $links[] = ['type' => 'demo', 'url' => $this->demo_url, 'text' => 'Demo'];
        }

        if ($this->github_url) {
            $links[] = ['type' => 'github', 'url' => $this->github_url, 'text' => 'Source Code'];
        }

        if ($this->case_study_url) {
            $links[] = ['type' => 'case_study', 'url' => $this->case_study_url, 'text' => 'Case Study'];
        }

        if ($this->app_store_url) {
            $links[] = ['type' => 'app_store', 'url' => $this->app_store_url, 'text' => 'App Store'];
        }

        return collect($links);
    }
}
