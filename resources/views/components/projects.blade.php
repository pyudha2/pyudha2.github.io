<section class="projects fade-in" id="projects">
    <h2 class="section-title">Featured Projects</h2>
    <div class="projects-grid">
        @forelse($projects as $project)
        <div class="project-card">
            <div class="project-image">
                @if($project['image'])
                <img src="{{ $project['image'] }}" alt="{{ $project['title'] }}" />
                @else
                {{ $project['emoji'] ?? '🚀' }}
                @endif
            </div>

            <h3 class="project-title">{{ $project['title'] }}</h3>

            <p class="project-description">
                {{ $project['description'] }}
            </p>

            @if($project['tech_stacks'] && count($project['tech_stacks']) > 0)
            <div class="project-tech">
                @foreach($project['tech_stacks'] as $tech)
                <span class="tech-tag">{{ $tech }}</span>
                @endforeach
            </div>
            @endif

            <div class="project-links">
                @if($project['demo_url'])
                <a href="{{ $project['demo_url'] }}" class="project-link" target="_blank" rel="noopener noreferrer">
                    Live Demo
                </a>
                @endif

                @if($project['github_url'])
                <a href="{{ $project['github_url'] }}" class="project-link" target="_blank" rel="noopener noreferrer">
                    Source Code
                </a>
                @endif

                @if($project['case_study_url'])
                <a href="{{ $project['case_study_url'] }}" class="project-link" target="_blank"
                    rel="noopener noreferrer">
                    Case Study
                </a>
                @endif

                @if($project['live_url'])
                <a href="{{ $project['live_url'] }}" class="project-link" target="_blank" rel="noopener noreferrer">
                    Live Site
                </a>
                @endif

                @if($project['app_store_url'])
                <a href="{{ $project['app_store_url'] }}" class="project-link" target="_blank"
                    rel="noopener noreferrer">
                    App Store
                </a>
                @endif
            </div>
        </div>
        @empty
        <div class="project-card">
            <div class="project-image">🚧</div>
            <h3 class="project-title">More Projects Coming Soon</h3>
            <p class="project-description">
                I'm constantly working on new and exciting projects.
                Check back soon for more updates!
            </p>
            <div class="project-tech">
                <span class="tech-tag">Laravel</span>
                <span class="tech-tag">React</span>
                <span class="tech-tag">Vue.js</span>
            </div>
            <div class="project-links">
                <a href="#contact" class="project-link">Get In Touch</a>
            </div>
        </div>
        @endforelse
    </div>
</section>