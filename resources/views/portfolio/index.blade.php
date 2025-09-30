@extends('layouts.portfolio')

@section('title', ($name ?? 'Pranata Yudha Pratama') . ' - Full Stack Developer')
@section('description', $description ?? 'Crafting digital experiences with cutting-edge technologies. Specializing in
web applications, mobile development, and scalable solutions.')

@section('content')
@include('components.hero')
@include('components.tech-stack', ['techStacks' => $techStacks])
@include('components.projects', ['projects' => $projects])
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // FIRST: Aggressively remove all title attributes from tech tags
        const removeAllTitles = () => {
            document.querySelectorAll('.tech-tag').forEach(tag => {
                tag.removeAttribute('title');
                // Also remove any onclick or other attributes that might trigger tooltips
                tag.removeAttribute('data-title');
                tag.removeAttribute('data-tooltip');
            });
        };
        
        // Remove immediately
        removeAllTitles();
        
        // Remove after delays (in case other scripts add them)
        setTimeout(removeAllTitles, 50);
        setTimeout(removeAllTitles, 100);
        setTimeout(removeAllTitles, 500);
        setTimeout(removeAllTitles, 1000);
        
        // Watch for any title attributes being added and remove them instantly
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'title' || 
                     mutation.attributeName === 'data-title' ||
                     mutation.attributeName === 'data-tooltip')) {
                    mutation.target.removeAttribute(mutation.attributeName);
                }
                
                // Check for newly added nodes
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('tech-tag')) {
                                node.removeAttribute('title');
                                node.removeAttribute('data-title');
                                node.removeAttribute('data-tooltip');
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('.tech-tag').forEach(tag => {
                                    tag.removeAttribute('title');
                                    tag.removeAttribute('data-title');
                                    tag.removeAttribute('data-tooltip');
                                });
                            }
                        }
                    });
                }
            });
        });
        
        // Observe the entire document for changes
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['title', 'data-title', 'data-tooltip']
        });
        
        // Also observe each tech tag individually
        document.querySelectorAll('.tech-tag').forEach(tag => {
            observer.observe(tag, {
                attributes: true,
                attributeFilter: ['title', 'data-title', 'data-tooltip']
            });
        });
        
        // Portfolio data from controller - now includes profile data
        window.portfolioData = {!! json_encode([
            'profile' => [
                'name' => $name ?? 'Pranata Yudha Pratama',
                'title' => $title ?? 'Full Stack Developer & Mobile Expert',
                'description' => $description ?? 'Crafting digital experiences with cutting-edge technologies.',
                'primaryButtonText' => $primaryButtonText ?? 'View My Work',
                'secondaryButtonText' => $secondaryButtonText ?? 'Let\'s Connect',
                'avatar' => $avatar ?? null,
                'resumeUrl' => $resumeUrl ?? null
            ],
            'projects' => $projects,
            'techStacks' => $techStacks,
            'socialLinks' => $socialLinks,
            'contactInfo' => $contactInfo ?? [],
            'stats' => $stats ?? []
        ]) !!};
        
        // Dynamic project filtering
        const filterProjects = (category = 'all') => {
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const projectCategory = card.dataset.category;
                if (category === 'all' || projectCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        };
        
        // Project search functionality
        const searchProjects = async (query) => {
            if (query.length < 2) return;
            
            try {
                const response = await fetch(`{{ route('portfolio.search') }}?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                
                // Update projects display
                updateProjectsDisplay(data.projects);
            } catch (error) {
                console.error('Search failed:', error);
            }
        };
        
        // Update projects display
        const updateProjectsDisplay = (projects) => {
            const projectsGrid = document.querySelector('.projects-grid');
            if (!projectsGrid) return;
            
            projectsGrid.innerHTML = projects.map(project => `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">${project.emoji || '🚀'}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech_stacks.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.links.map(link => `<a href="${link.url}" target="_blank" class="project-link">${link.label}</a>`).join('')}
                    </div>
                </div>
            `).join('');
            
            // Remove titles from newly created tech tags
            setTimeout(removeAllTitles, 50);
            
            // Re-apply animations and interactions
            initProjectInteractions();
        };
        
        // Initialize project interactions
        const initProjectInteractions = () => {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                });
            });
        };
        
        // Initialize on load
        initProjectInteractions();
        
        // Lazy loading for project images
        const lazyLoadImages = () => {
            const images = document.querySelectorAll('.project-image[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.backgroundImage = `url(${img.dataset.src})`;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        };
        
        lazyLoadImages();
        
        // Console log to verify data is loaded correctly
        console.log('Portfolio data loaded:', window.portfolioData);
    });
</script>
@endpush