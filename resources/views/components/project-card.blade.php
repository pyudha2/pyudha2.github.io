@props([
'project',
'index' => 0
])

<div class="project-card" data-animation-delay="{{ $index * 100 }}">
    <div class="project-image">
        @if($project->image_url)
        <img src="{{ asset($project->image_url) }}" alt="{{ $project->title }}"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">
        @else
        {{ $project->icon ?? '🚀' }}
        @endif
    </div>

    <h3 class="project-title">{{ $project->title }}</h3>

    <p class="project-description">
        {{ $project->description }}
    </p>

    <div class="project-tech">
        @foreach($project->techStacks as $tech)
        <span class="tech-tag">{{ $tech->name }}</span>
        @endforeach
    </div>

    <div class="project-links">
        @if($project->demo_url)
        <a href="{{ $project->demo_url }}" class="project-link" target="_blank" rel="noopener noreferrer">
            {{ $project->demo_text ?? 'Live Demo' }}
        </a>
        @endif

        @if($project->source_url)
        <a href="{{ $project->source_url }}" class="project-link" target="_blank" rel="noopener noreferrer">
            {{ $project->source_text ?? 'Source Code' }}
        </a>
        @endif

        @if($project->case_study_url)
        <a href="{{ $project->case_study_url }}" class="project-link" target="_blank" rel="noopener noreferrer">
            Case Study
        </a>
        @endif

        @if($project->documentation_url)
        <a href="{{ $project->documentation_url }}" class="project-link" target="_blank" rel="noopener noreferrer">
            Documentation
        </a>
        @endif

        @if($project->app_store_url)
        <a href="{{ $project->app_store_url }}" class="project-link" target="_blank" rel="noopener noreferrer">
            App Store
        </a>
        @endif

        @if($project->custom_link_url)
        <a href="{{ $project->custom_link_url }}" class="project-link" target="_blank" rel="noopener noreferrer">
            {{ $project->custom_link_text ?? 'View Project' }}
        </a>
        @endif
    </div>

    {{-- Additional metadata --}}
    @if($project->status || $project->year || $project->client)
    <div class="project-meta"
        style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        @if($project->status)
        <span class="project-status" style="
                    display: inline-block;
                    padding: 4px 12px;
                    background: {{ $project->status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : ($project->status === 'ongoing' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)') }};
                    color: {{ $project->status === 'completed' ? '#10b981' : ($project->status === 'ongoing' ? '#3b82f6' : '#f59e0b') }};
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    margin-right: 8px;
                ">
            {{ ucfirst($project->status) }}
        </span>
        @endif

        @if($project->year)
        <span class="project-year" style="
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-right: 8px;
                ">
            {{ $project->year }}
        </span>
        @endif

        @if($project->client)
        <span class="project-client" style="
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-style: italic;
                ">
            Client: {{ $project->client }}
        </span>
        @endif
    </div>
    @endif

    {{-- Project stats if available --}}
    @if($project->users_count || $project->downloads_count || $project->github_stars)
    <div class="project-stats" style="margin-top: 15px; display: flex; gap: 15px; flex-wrap: wrap;">
        @if($project->users_count)
        <div class="stat-item"
            style="display: flex; align-items: center; gap: 5px; color: var(--text-secondary); font-size: 0.9rem;">
            <span>👥</span>
            <span>{{ number_format($project->users_count) }}{{ $project->users_count >= 1000 ? '+' : '' }} users</span>
        </div>
        @endif

        @if($project->downloads_count)
        <div class="stat-item"
            style="display: flex; align-items: center; gap: 5px; color: var(--text-secondary); font-size: 0.9rem;">
            <span>⬇️</span>
            <span>{{ number_format($project->downloads_count) }} downloads</span>
        </div>
        @endif

        @if($project->github_stars)
        <div class="stat-item"
            style="display: flex; align-items: center; gap: 5px; color: var(--text-secondary); font-size: 0.9rem;">
            <span>⭐</span>
            <span>{{ $project->github_stars }} stars</span>
        </div>
        @endif
    </div>
    @endif