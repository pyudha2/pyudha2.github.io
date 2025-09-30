<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TechStack;
use Illuminate\View\View;
use App\Models\SocialLink;
use Illuminate\Http\Request;
use App\Http\Services\PortfolioService;

class PortfolioController extends Controller
{
    protected $portfolioService;

    public function __construct(PortfolioService $portfolioService)
    {
        $this->portfolioService = $portfolioService;
    }

    /**
     * Display the main portfolio page
     */
    public function index(): View
    {
        $data = $this->portfolioService->getPortfolioData();
        $profile = $data['profile'];

        // Extract profile data for Blade template
        return view('portfolio.index', [
            'name' => $profile['name'],
            'title' => $profile['title'],
            'description' => $profile['description'],
            'primaryButtonText' => $profile['primaryButtonText'],
            'secondaryButtonText' => $profile['secondaryButtonText'],
            'avatar' => $profile['avatar'] ?? null,
            'resumeUrl' => $profile['resume_url'] ?? null,
            'projects' => $data['projects'],
            'techStacks' => $data['tech_stacks'],
            'socialLinks' => $data['social_links'],
            'stats' => $data['stats'],
            'contactInfo' => [] // Add if needed
        ]);
    }

    /**
     * Display a specific project
     */
    public function project(Project $project): View
    {
        // Ensure project is active
        if (!$project->is_active) {
            abort(404);
        }

        $relatedProjects = $this->getRelatedProjects($project);

        // Get tech stacks data for the project view if needed
        $data = $this->portfolioService->getPortfolioData();
        $techStacks = $data['tech_stacks'];

        return view('portfolio.project', compact('project', 'relatedProjects', 'techStacks'));
    }

    /**
     * API endpoint to get portfolio data as JSON
     */
    public function apiData(): \Illuminate\Http\JsonResponse
    {
        $data = $this->portfolioService->getPortfolioData();

        return response()->json($data);
    }

    /**
     * API endpoint to get specific project data
     */
    public function apiProject(Project $project): \Illuminate\Http\JsonResponse
    {
        if (!$project->is_active) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $project->load('techStacks');

        return response()->json([
            'project' => $project,
            'related_projects' => $this->getRelatedProjects($project)
        ]);
    }

    /**
     * Search projects
     */
    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = $request->get('q');
        $category = $request->get('category');

        $projects = $this->portfolioService->searchProjects($query);

        return response()->json([
            'projects' => $projects,
            'total' => $projects->count(),
            'query' => $query,
            'category' => $category
        ]);
    }

    /**
     * Get tech stack data grouped by category
     */
    public function techStack(): \Illuminate\Http\JsonResponse
    {
        $techStacks = $this->portfolioService->getTechStacksByCategory();

        return response()->json($techStacks);
    }

    /**
     * Get all active social links
     */
    public function socialLinks(): \Illuminate\Http\JsonResponse
    {
        $socialLinks = $this->portfolioService->getSocialLinks();

        return response()->json($socialLinks);
    }

    /**
     * Get related projects based on shared tech stacks or categories
     */
    private function getRelatedProjects(Project $project, int $limit = 4)
    {
        return Project::where('id', '!=', $project->id)
            ->where('is_active', true)
            ->whereHas('techStacks', function ($query) use ($project) {
                $query->whereIn('tech_stack_id', $project->techStacks->pluck('id'));
            })
            ->orWhere('category', $project->category)
            ->limit($limit)
            ->get();
    }
}
