@extends('layouts.portfolio')

@section('title', $project->title . ' - Pranata Yudha Pratama Portfolio')

@section('meta')
<meta name="description" content="{{ Str::limit($project->description, 160) }}">
<meta name="keywords" content="{{ $project->techStacks->pluck('name')->join(', ') }}">

<!-- Open Graph -->
<meta property="og:title" content="{{ $project->title }} - Pranata Yudha Pratama Portfolio">
<meta property="og:description" content="{{ Str::limit($project->description, 160) }}">
<meta property="og:image" content="{{ $project->image_url }}">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $project->title }}">
<meta name="twitter:description" content="{{ Str::limit($project->description, 160) }}">
<meta name="twitter:image" content="{{ $project->image_url }}">
@endsection

@section('content')
<!-- Back Navigation -->
<div class="back-navigation">
    <a href="{{ route('portfolio.index') }}#projects" class="back-btn">
        <span>←</span> Back to Portfolio
    </a>
</div>

<!-- Project Hero Section -->
<section class="project-hero">
    <div class="project-hero-content">
        <div class="project-category">{{ ucfirst($project->category) }}</div>
        <h1 class="project-hero-title">{{ $project->title }}</h1>
        <p class="project-hero-description">{{ $project->short_description }}</p>

        <div class="project-stats">
            @if($project->status)
            <div class="stat-item">
                <span class="stat-label">Status</span>
                <span class="stat-value status-{{ strtolower($project->status) }}">{{ $project->status }}</span>
            </div>
            @endif

            @if($project->duration)
            <div class="stat-item">
                <span class="stat-label">Duration</span>
                <span class="stat-value">{{ $project->duration }}</span>
            </div>
            @endif

            @if($project->team_size)
            <div class="stat-item">
                <span class="stat-label">Team Size</span>
                <span class="stat-value">{{ $project->team_size }}</span>
            </div>
            @endif
        </div>

        <div class="project-hero-actions">
            @if($project->live_url)
            <a href="{{ $project->live_url }}" target="_blank" rel="noopener" class="btn btn-primary">
                🌐 Live Demo
            </a>
            @endif

            @if($project->github_url)
            <a href="{{ $project->github_url }}" target="_blank" rel="noopener" class="btn btn-secondary">
                🐙 Source Code
            </a>
            @endif

            @if($project->case_study_url)
            <a href="{{ $project->case_study_url }}" target="_blank" rel="noopener" class="btn btn-secondary">
                📊 Case Study
            </a>
            @endif
        </div>
    </div>

    <div class="project-hero-image">
        <div class="project-image-container">
            @if($project->image_url)
            <img src="{{ $project->image_url }}" alt="{{ $project->title }}" class="project-main-image">
            @else
            <div class="project-placeholder">
                {{ $project->emoji ?? '🚀' }}
            </div>
            @endif
        </div>
    </div>
</section>

<!-- Project Details -->
<section class="project-details">
    <div class="project-content">
        <div class="project-main">
            <!-- Overview -->
            <div class="project-section">
                <h2 class="section-title">Project Overview</h2>
                <div class="section-content">
                    {!! nl2br(e($project->description)) !!}
                </div>
            </div>

            <!-- Key Features -->
            @if($project->features)
            <div class="project-section">
                <h2 class="section-title">Key Features</h2>
                <div class="features-grid">
                    @foreach($project->features as $feature)
                    <div class="feature-item">
                        <div class="feature-icon">✨</div>
                        <div class="feature-content">
                            <h3 class="feature-title">{{ $feature['title'] }}</h3>
                            <p class="feature-description">{{ $feature['description'] }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Challenges & Solutions -->
            @if($project->challenges)
            <div class="project-section">
                <h2 class="section-title">Challenges & Solutions</h2>
                <div class="challenges-list">
                    @foreach($project->challenges as $challenge)
                    <div class="challenge-item">
                        <div class="challenge-problem">
                            <h4>Challenge:</h4>
                            <p>{{ $challenge['problem'] }}</p>
                        </div>
                        <div class="challenge-solution">
                            <h4>Solution:</h4>
                            <p>{{ $challenge['solution'] }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Gallery -->
            @if($project->gallery)
            <div class="project-section">
                <h2 class="section-title">Project Gallery</h2>
                <div class="project-gallery">
                    @foreach($project->gallery as $image)
                    <div class="gallery-item">
                        <img src="{{ $image['url'] }}" alt="{{ $image['caption'] ?? $project->title }}" loading="lazy">
                        @if($image['caption'])
                        <div class="gallery-caption">{{ $image['caption'] }}</div>
                        @endif
                    </div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>

        <!-- Sidebar -->
        <div class="project-sidebar">
            <!-- Tech Stack -->
            @if($project->techStacks->count() > 0)
            <div class="sidebar-section">
                <h3 class="sidebar-title">Technologies Used</h3>
                <div class="tech-tags-sidebar">
                    @foreach($project->techStacks as $tech)
                    <span class="tech-tag">{{ $tech->name }}</span>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Project Info -->
            <div class="sidebar-section">
                <h3 class="sidebar-title">Project Information</h3>
                <div class="project-info-list">
                    @if($project->client)
                    <div class="info-item">
                        <span class="info-label">Client:</span>
                        <span class="info-value">{{ $project->client }}</span>
                    </div>
                    @endif

                    @if($project->role)
                    <div class="info-item">
                        <span class="info-label">Role:</span>
                        <span class="info-value">{{ $project->role }}</span>
                    </div>
                    @endif

                    @if($project->year)
                    <div class="info-item">
                        <span class="info-label">Year:</span>
                        <span class="info-value">{{ $project->year }}</span>
                    </div>
                    @endif

                    <div class="info-item">
                        <span class="info-label">Category:</span>
                        <span class="info-value">{{ ucfirst($project->category) }}</span>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="sidebar-section">
                <h3 class="sidebar-title">Quick Actions</h3>
                <div class="sidebar-actions">
                    @if($project->live_url)
                    <a href="{{ $project->live_url }}" target="_blank" rel="noopener" class="sidebar-btn">
                        🌐 Visit Live Site
                    </a>
                    @endif

                    @if($project->github_url)
                    <a href="{{ $project->github_url }}" target="_blank" rel="noopener" class="sidebar-btn">
                        🐙 View Code
                    </a>
                    @endif

                    <a href="mailto:alex.chen@example.com?subject=Inquiry about {{ $project->title }}"
                        class="sidebar-btn">
                        📧 Discuss Project
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Related Projects -->
@if($relatedProjects->count() > 0)
<section class="related-projects">
    <div class="section-header">
        <h2 class="section-title">Related Projects</h2>
        <p class="section-subtitle">Other projects you might find interesting</p>
    </div>

    <div class="related-projects-grid">
        @foreach($relatedProjects as $relatedProject)
        <div class="related-project-card">
            <a href="{{ route('portfolio.project', $relatedProject) }}" class="project-link">
                <div class="related-project-image">
                    @if($relatedProject->image_url)
                    <img src="{{ $relatedProject->image_url }}" alt="{{ $relatedProject->title }}">
                    @else
                    <div class="project-emoji">{{ $relatedProject->emoji ?? '🚀' }}</div>
                    @endif
                </div>

                <div class="related-project-content">
                    <div class="related-project-category">{{ ucfirst($relatedProject->category) }}</div>
                    <h3 class="related-project-title">{{ $relatedProject->title }}</h3>
                    <p class="related-project-description">{{ Str::limit($relatedProject->short_description, 100) }}</p>

                    <div class="related-project-tech">
                        @foreach($relatedProject->techStacks->take(3) as $tech)
                        <span class="tech-tag">{{ $tech->name }}</span>
                        @endforeach
                        @if($relatedProject->techStacks->count() > 3)
                        <span class="tech-tag more">+{{ $relatedProject->techStacks->count() - 3 }}</span>
                        @endif
                    </div>
                </div>
            </a>
        </div>
        @endforeach
    </div>
</section>
@endif

<!-- Call to Action -->
<section class="project-cta">
    <div class="cta-content">
        <h2 class="cta-title">Interested in Working Together?</h2>
        <p class="cta-description">
            I'm always excited to discuss new projects and opportunities.
            Let's create something amazing together!
        </p>
        <div class="cta-buttons">
            <a href="{{ route('portfolio.index') }}#contact" class="btn btn-primary">Get In Touch</a>
            <a href="{{ route('portfolio.index') }}#projects" class="btn btn-secondary">View More Projects</a>
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Back button with history
    const backBtn = document.querySelector('.back-btn');
    if (backBtn && window.history.length > 1) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    }
});

function openLightbox(src, alt) {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}" class="lightbox-image">
            <button class="lightbox-close">&times;</button>
            <div class="lightbox-caption">${alt}</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Close lightbox events
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.className === 'lightbox-close') {
            document.body.removeChild(overlay);
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.parentNode) {
            document.body.removeChild(overlay);
        }
    });
}
</script>
@endpush