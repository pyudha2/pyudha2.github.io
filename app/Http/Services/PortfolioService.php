<?php

namespace App\Http\Services;

use App\Models\Project;
use App\Models\TechStack;
use App\Models\Contact;
use App\Models\SocialLink;
use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

class PortfolioService
{
    /**
     * Get portfolio data for the main page.
     */
    public function getPortfolioData(): array
    {
        return Cache::remember('portfolio_data', 3600, function () {
            return [
                'profile' => $this->getProfileData(),
                'projects' => $this->getFeaturedProjects(),
                'tech_stacks' => $this->getTechStacksByCategory(),
                'social_links' => $this->getSocialLinks(),
                'stats' => $this->getPortfolioStats()
            ];
        });
    }

    /**
     * Get user profile data.
     */
    public function getProfileData(): array
    {
        // You can store this in database or config file
        // For now, returning static data
        return [
            'name' => 'Pranata Yudha Pratama',
            'title' => 'Full Stack Developer & Mobile Expert',
            'description' => 'Crafting digital experiences with cutting-edge technologies. Specializing in web applications, mobile development, and scalable solutions.',
            'primaryButtonText' => 'View My Work',
            'secondaryButtonText' => 'Let\'s Connect',
            'avatar' => asset('images/avatar.jpg'), // Add your avatar path
            'resume_url' => asset('files/resume.pdf'), // Add your resume path
        ];
    }

    /**
     * Get featured projects with tech stacks.
     * Changed return type from Collection to SupportCollection since we're using map()
     */
    public function getFeaturedProjects(): SupportCollection
    {
        return Project::with('techStacks')
            ->where('is_featured', true)
            ->where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'title' => $project->title,
                    'slug' => $project->slug,
                    'description' => $project->description,
                    'emoji' => $project->emoji ?: '🚀',
                    'image' => $project->image ? asset('storage/' . $project->image) : null,
                    'live_url' => $project->live_url,
                    'demo_url' => $project->demo_url,
                    'github_url' => $project->github_url,
                    'case_study_url' => $project->case_study_url,
                    'app_store_url' => $project->app_store_url,
                    'tech_stacks' => $project->techStacks->pluck('name')->toArray(),
                    'links' => $this->getProjectLinks($project)
                ];
            });
    }

    // ... rest of your existing methods remain the same ...

    /**
     * Get all projects (for admin or full portfolio view).
     */
    public function getAllProjects(): Collection
    {
        return Project::with('techStacks')
            ->where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get tech stacks grouped by category.
     */
    public function getTechStacksByCategory(): array
    {
        return Cache::remember('tech_stacks', 7200, function () {
            // Get all active tech stacks grouped by category
            $techStacks = TechStack::where('is_active', true)
                ->orderBy('order')
                ->orderBy('name')
                ->get()
                ->groupBy('category');

            // Transform to the format expected by the Blade template
            $result = [];
            foreach ($techStacks as $category => $stacks) {
                $result[] = [
                    'title' => $category,
                    'technologies' => $stacks->map(function ($stack) {
                        return [
                            'name' => $stack->name
                        ];
                    })->toArray()
                ];
            }

            return $result;
        });
    }

    /**
     * Get social links.
     */
    public function getSocialLinks(): Collection
    {
        return Cache::remember('social_links', 7200, function () {
            return SocialLink::where('is_active', true)
                ->orderBy('order', 'asc')
                ->orderBy('name')
                ->get(['name', 'url', 'icon']);
        });
    }

    /**
     * Get portfolio statistics.
     */
    public function getPortfolioStats(): array
    {
        return Cache::remember('portfolio_stats', 1800, function () {
            return [
                'total_projects' => Project::where('is_active', true)->count(),
                'featured_projects' => Project::where('is_featured', true)
                    ->where('is_active', true)->count(),
                'tech_categories' => TechStack::where('is_active', true)
                    ->distinct('category')->count('category'),
                'total_contacts' => Contact::count(),
                'recent_contacts' => Contact::where('created_at', '>=', now()->subDays(30))->count()
            ];
        });
    }

    // ... rest of your existing methods remain the same ...

    /**
     * Clear portfolio cache.
     */
    public function clearCache(): void
    {
        Cache::forget('portfolio_data');
        Cache::forget('tech_stacks');
        Cache::forget('social_links');
        Cache::forget('portfolio_stats');

        // Clear project slug caches (this would need a more sophisticated approach in production)
        // For now, just flush the cache entirely for the pattern
        if (Cache::getStore() instanceof \Illuminate\Cache\TaggableStore) {
            Cache::tags(['portfolio'])->flush();
        }
    }

    /**
     * Get project links formatted for display.
     */
    private function getProjectLinks(Project $project): array
    {
        $links = [];

        if ($project->live_url) {
            $links[] = [
                'type' => 'live',
                'url' => $project->live_url,
                'label' => 'Live Demo',
                'icon' => '🌐'
            ];
        }

        if ($project->demo_url) {
            $links[] = [
                'type' => 'demo',
                'url' => $project->demo_url,
                'label' => 'Demo',
                'icon' => '🎮'
            ];
        }

        if ($project->github_url) {
            $links[] = [
                'type' => 'github',
                'url' => $project->github_url,
                'label' => 'Source Code',
                'icon' => '🐙'
            ];
        }

        if ($project->case_study_url) {
            $links[] = [
                'type' => 'case_study',
                'url' => $project->case_study_url,
                'label' => 'Case Study',
                'icon' => '📋'
            ];
        }

        if ($project->app_store_url) {
            $links[] = [
                'type' => 'app_store',
                'url' => $project->app_store_url,
                'label' => 'App Store',
                'icon' => '📱'
            ];
        }

        return $links;
    }

    /**
     * Store contact form submission.
     */
    public function storeContact(array $data): Contact
    {
        $contact = Contact::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'project_type' => $data['project_type'] ?? null,
            'message' => $data['message'],
            'ip_address' => request()->ip(),
            'status' => 'new'
        ]);

        // Send email notification
        try {
            Mail::send(new ContactFormMail($contact));
            Log::info('Contact form email sent successfully', ['contact_id' => $contact->id]);
        } catch (\Exception $e) {
            Log::error('Failed to send contact form email', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage()
            ]);
        }

        return $contact;
    }

    /**
     * Get project by slug with tech stacks.
     */
    public function getProjectBySlug(string $slug): ?Project
    {
        return Cache::remember("project_slug_{$slug}", 3600, function () use ($slug) {
            return Project::with('techStacks')
                ->where('slug', $slug)
                ->where('is_active', true)
                ->first();
        });
    }

    /**
     * Search projects by technology or title.
     */
    public function searchProjects(string $query): Collection
    {
        $query = strtolower(trim($query));

        return Project::with('techStacks')
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'ILIKE', "%{$query}%")
                    ->orWhere('description', 'ILIKE', "%{$query}%")
                    ->orWhereHas('techStacks', function ($tech) use ($query) {
                        $tech->where('name', 'ILIKE', "%{$query}%");
                    });
            })
            ->orderBy('is_featured', 'desc')
            ->orderBy('order', 'asc')
            ->get();
    }

    /**
     * Get contact messages with pagination and filtering.
     */
    public function getContacts(array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Contact::query();

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['project_type'])) {
            $query->where('project_type', $filters['project_type']);
        }

        if (!empty($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        if (!empty($filters['search'])) {
            $search = strtolower(trim($filters['search']));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('email', 'ILIKE', "%{$search}%")
                    ->orWhere('message', 'ILIKE', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Mark contact as read.
     */
    public function markContactAsRead(int $contactId): bool
    {
        $contact = Contact::find($contactId);

        if (!$contact) {
            return false;
        }

        $contact->update([
            'status' => 'read',
            'read_at' => now()
        ]);

        return true;
    }

    /**
     * Update contact status.
     */
    public function updateContactStatus(int $contactId, string $status): bool
    {
        $validStatuses = ['new', 'read', 'replied'];

        if (!in_array($status, $validStatuses)) {
            return false;
        }

        $contact = Contact::find($contactId);

        if (!$contact) {
            return false;
        }

        $updateData = ['status' => $status];

        if ($status === 'read' && !$contact->read_at) {
            $updateData['read_at'] = now();
        }

        $contact->update($updateData);

        return true;
    }

    /**
     * Get project type options for contact form.
     */
    public function getProjectTypeOptions(): array
    {
        return [
            'web-application' => 'Web Application',
            'mobile-app' => 'Mobile App',
            'e-commerce' => 'E-commerce Platform',
            'saas-platform' => 'SaaS Platform',
            'api-development' => 'API Development',
            'consultation' => 'Technical Consultation',
            'other' => 'Other'
        ];
    }
}
