<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TechStack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of projects
     */
    public function index(Request $request)
    {
        $query = Project::with('techStacks')->active()->ordered();

        // Filter by featured if requested
        if ($request->has('featured')) {
            $query->featured();
        }

        // Filter by technology
        if ($request->has('tech')) {
            $techSlug = $request->get('tech');
            $query->whereHas('techStacks', function ($q) use ($techSlug) {
                $q->where('name', 'like', "%{$techSlug}%");
            });
        }

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $projects = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'projects' => $projects,
                'total' => $projects->count()
            ]);
        }

        return view('projects.index', compact('projects'));
    }

    /**
     * Display the specified project
     */
    public function show(Project $project)
    {
        if (!$project->is_active) {
            abort(404);
        }

        $project->load('techStacks');

        // Get related projects (same tech stack)
        $relatedProjects = Project::active()
            ->where('id', '!=', $project->id)
            ->whereHas('techStacks', function ($query) use ($project) {
                $query->whereIn('tech_stack_id', $project->techStacks->pluck('id'));
            })
            ->orderBy('is_featured', 'desc')
            ->take(3)
            ->get();

        return view('projects.show', compact('project', 'relatedProjects'));
    }

    /**
     * Store a newly created project (Admin only)
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'emoji' => 'nullable|string|max:10',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'live_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'case_study_url' => 'nullable|url',
            'app_store_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'tech_stacks' => 'array',
            'tech_stacks.*' => 'exists:tech_stacks,id',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
            $validated['image'] = basename($imagePath);
        }

        // Generate slug
        $validated['slug'] = Str::slug($validated['title']);

        // Set order
        $validated['order'] = Project::max('order') + 1;

        $project = Project::create($validated);

        // Attach tech stacks
        if (!empty($validated['tech_stacks'])) {
            $project->techStacks()->attach($validated['tech_stacks']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'project' => $project->load('techStacks')
        ]);
    }

    /**
     * Update the specified project (Admin only)
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'emoji' => 'nullable|string|max:10',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'live_url' => 'nullable|url',
            'demo_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'case_study_url' => 'nullable|url',
            'app_store_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'tech_stacks' => 'array',
            'tech_stacks.*' => 'exists:tech_stacks,id',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($project->image) {
                Storage::disk('public')->delete('projects/' . $project->image);
            }

            $imagePath = $request->file('image')->store('projects', 'public');
            $validated['image'] = basename($imagePath);
        }

        // Update slug if title changed
        if ($project->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project->update($validated);

        // Sync tech stacks
        if (isset($validated['tech_stacks'])) {
            $project->techStacks()->sync($validated['tech_stacks']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'project' => $project->fresh()->load('techStacks')
        ]);
    }

    /**
     * Remove the specified project (Admin only)
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        // Delete image file
        if ($project->image) {
            Storage::disk('public')->delete('projects/' . $project->image);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }

    /**
     * Update project order (Admin only)
     */
    public function updateOrder(Request $request)
    {
        $this->authorize('update', Project::class);

        $validated = $request->validate([
            'projects' => 'required|array',
            'projects.*.id' => 'required|exists:projects,id',
            'projects.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['projects'] as $projectData) {
            Project::where('id', $projectData['id'])
                ->update(['order' => $projectData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project order updated successfully'
        ]);
    }

    /**
     * Toggle project featured status (Admin only)
     */
    public function toggleFeatured(Project $project)
    {
        $this->authorize('update', $project);

        $project->update(['is_featured' => !$project->is_featured]);

        return response()->json([
            'success' => true,
            'message' => 'Project featured status updated',
            'is_featured' => $project->is_featured
        ]);
    }
}
