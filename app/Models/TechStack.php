<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class TechStack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    // Categories from the design
    const CATEGORIES = [
        'Backend Development',
        'Frontend Development',
        'Mobile Development',
        'DevOps & Cloud'
    ];

    // Relationships
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_tech_stack');
    }

    // Scopes
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory(Builder $query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy('order')->orderBy('name');
    }

    // Static methods
    public static function getGroupedByCategory()
    {
        return self::active()
            ->ordered()
            ->get()
            ->groupBy('category')
            ->sortKeys();
    }

    public static function getCategoriesWithTech()
    {
        $categories = [];

        foreach (self::CATEGORIES as $category) {
            $techs = self::active()
                ->byCategory($category)
                ->ordered()
                ->get();

            if ($techs->isNotEmpty()) {
                $categories[$category] = $techs;
            }
        }

        return $categories;
    }
}
