/**
 * Portfolio Interactive JavaScript
 * Handles all animations, interactions, and dynamic content loading
 * Compatible with Laravel backend and modern browsers
 */

class PortfolioManager {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAnimations();
        this.initScrollAnimations();
    }

    init() {
        // Configuration
        this.config = {
            apiBaseUrl: '/api',
            animationDelay: 100,
            scrollThreshold: 0.1,
            particleCount: 50
        };

        // State management
        this.state = {
            isLoaded: false,
            currentSection: 'home',
            projects: [],
            techStacks: [],
            contacts: []
        };

        // DOM elements cache
        this.elements = {
            nav: document.querySelector('nav'),
            heroTitle: document.querySelector('.hero-title'),
            heroSubtitle: document.querySelector('.hero-subtitle'),
            contactForm: document.querySelector('.contact-form'),
            projectsGrid: document.querySelector('.projects-grid'),
            techGrid: document.querySelector('.tech-grid'),
            floatingElements: document.querySelectorAll('.floating-element')
        };
    }

    bindEvents() {
        // Navigation events
        this.setupSmoothScrolling();
        this.setupNavigationHighlight();

        // Form events
        this.setupContactForm();

        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Interactive elements
        this.setupProjectCards();
        this.setupTechTags();
        this.setupSocialLinks();
    }

    setupAnimations() {
        this.initParticleSystem();
        this.initTypingAnimation();
        this.initScrollAnimations();
        this.initParallaxEffects();
    }

    // Smooth Scrolling Navigation
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    this.updateCurrentSection(targetId);
                }
            });
        });
    }

    setupNavigationHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateCurrentSection(sectionId);

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    updateCurrentSection(sectionId) {
        this.state.currentSection = sectionId;
        document.body.setAttribute('data-current-section', sectionId);
    }

    // Contact Form Management
    setupContactForm() {
        if (!this.elements.contactForm) return;

        this.elements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleContactSubmission(e.target);
        });

        // Real-time validation
        const inputs = this.elements.contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleContactSubmission(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        try {
            // Show loading state
            this.setButtonState(button, 'loading', 'Sending...');

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.setButtonState(button, 'success', 'Message Sent! ✅');
                form.reset();
                this.showNotification('Message sent successfully!', 'success');
            } else {
                throw new Error('Failed to send message');
            }

        } catch (error) {
            console.error('Contact form error:', error);
            this.setButtonState(button, 'error', 'Error occurred');
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            setTimeout(() => {
                this.setButtonState(button, 'default', originalText);
            }, 3000);
        }
    }

    setButtonState(button, state, text) {
        button.textContent = text;
        button.className = `btn btn-primary btn-${state}`;

        const colors = {
            loading: 'linear-gradient(135deg, #f59e0b, #d97706)',
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            default: 'var(--gradient)'
        };

        button.style.background = colors[state] || colors.default;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type || field.tagName.toLowerCase();
        let isValid = true;
        let errorMessage = '';

        // Basic validation rules
        switch (fieldType) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
            default:
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
        }

        this.displayFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    displayFieldValidation(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');

        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            field.classList.add('field-invalid');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            field.parentNode.appendChild(errorElement);
        } else {
            field.classList.remove('field-invalid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('field-invalid');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Project Cards Interactive Effects
    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            // 3D hover effect
            card.addEventListener('mousemove', (e) => {
                this.apply3DEffect(card, e);
            });

            card.addEventListener('mouseleave', () => {
                this.reset3DEffect(card);
            });

            // Click to expand
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.project-link')) {
                    this.expandProjectCard(card);
                }
            });

            // Lazy load project images
            this.setupLazyLoading(card);
        });
    }

    apply3DEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(20px) 
            scale(1.02)
        `;
    }

    reset3DEffect(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    }

    expandProjectCard(card) {
        card.classList.toggle('expanded');

        if (card.classList.contains('expanded')) {
            // Load additional project details
            const projectId = card.dataset.projectId;
            if (projectId) {
                this.loadProjectDetails(projectId, card);
            }
        }
    }

    async loadProjectDetails(projectId, card) {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/projects/${projectId}`);
            const project = await response.json();

            this.rnz5UXKNZN4yKaBqkuBnEQF4aTS8N1j6TL(card, project);
        } catch (error) {
            console.error('Failed to load project details:', error);
        }
    }

    rnz5UXKNZN4yKaBqkuBnEQF4aTS8N1j6TL(card, project) {
        const existingExpanded = card.querySelector('.expanded-content');
        if (existingExpanded) return;

        const expandedContent = document.createElement('div');
        expandedContent.className = 'expanded-content';
        expandedContent.innerHTML = `
            <div class="project-gallery">
                ${project.images ? project.images.map(img =>
            `<img src="${img.url}" alt="${img.alt}" class="project-screenshot">`
        ).join('') : ''}
            </div>
            <div class="project-details">
                <h4>Key Features</h4>
                <ul class="feature-list">
                    ${project.features ? project.features.map(feature =>
            `<li>${feature}</li>`
        ).join('') : ''}
                </ul>
                <div class="project-stats">
                    <div class="stat">
                        <span class="stat-value">${project.stats?.users || '0'}</span>
                        <span class="stat-label">Active Users</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${project.stats?.performance || '0'}ms</span>
                        <span class="stat-label">Load Time</span>
                    </div>
                </div>
            </div>
        `;

        card.appendChild(expandedContent);
    }

    // Tech Stack Interactions
    setupTechTags() {
        const techTags = document.querySelectorAll('.tech-tag');

        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.animateTechTag(tag, 'enter');
                // Removed: this.showTechTooltip(tag);
            });

            tag.addEventListener('mouseleave', () => {
                this.animateTechTag(tag, 'leave');
                // Removed: this.hideTechTooltip(tag);
            });

            tag.addEventListener('click', () => {
                this.filterProjectsByTech(tag.textContent);
            });
        });
    }

    animateTechTag(tag, action) {
        const animations = {
            enter: 'scale(1.1) rotate(2deg)',
            leave: 'scale(1) rotate(0deg)'
        };

        tag.style.transform = animations[action];
    }

    showTechTooltip(tag) {
        const tooltip = this.createTooltip(tag.textContent);
        document.body.appendChild(tooltip);

        tag.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 30 + 'px';
        });
    }

    createTooltip(content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = `Click to filter projects using ${content}`;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        setTimeout(() => tooltip.style.opacity = '1', 10);
        return tooltip;
    }

    hideTechTooltip() {
        const tooltip = document.querySelector('.tech-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }
    }

    filterProjectsByTech(techName) {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const techTags = card.querySelectorAll('.tech-tag');
            const hasTech = Array.from(techTags).some(tag =>
                tag.textContent.trim() === techName.trim()
            );

            if (hasTech) {
                card.style.transform = 'scale(1.05)';
                card.style.zIndex = '10';
            } else {
                card.style.opacity = '0.5';
                card.style.transform = 'scale(0.95)';
            }
        });

        // Reset after 3 seconds
        setTimeout(() => {
            projectCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                card.style.zIndex = 'auto';
            });
        }, 3000);
    }

    // Social Links
    setupSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');

        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'scale(1.2) rotateY(180deg)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'scale(1) rotateY(0deg)';
            });
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: this.config.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in, .tech-category, .project-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.classList.add('visible');

        // Stagger animation for grid items
        if (element.parentNode.classList.contains('tech-grid') ||
            element.parentNode.classList.contains('projects-grid')) {

            const siblings = Array.from(element.parentNode.children);
            const index = siblings.indexOf(element);

            setTimeout(() => {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            }, index * this.config.animationDelay);
        }
    }

    // Particle System
    initParticleSystem() {
        const canvas = this.createParticleCanvas();
        const ctx = canvas.getContext('2d');
        const particles = [];

        // Create particles
        for (let i = 0; i < this.config.particleCount; i++) {
            particles.push(this.createParticle(canvas));
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                this.updateParticle(particle, canvas);
                this.drawParticle(ctx, particle);
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    createParticleCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        return canvas;
    }

    createParticle(canvas) {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
    }

    updateParticle(particle, canvas) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
    }

    drawParticle(ctx, particle) {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Typing Animation
    initTypingAnimation() {
        if (!this.elements.heroSubtitle) return;

        const text = this.elements.heroSubtitle.textContent;
        this.elements.heroSubtitle.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                this.elements.heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        setTimeout(typeWriter, 1500);
    }


    // Parallax Effects
    initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            // Parallax for floating elements
            this.elements.floatingElements.forEach((element, index) => {
                const speed = 0.1 * (index + 1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Dynamic color changes
            const scrollPercent = (scrolled / (document.body.scrollHeight - window.innerHeight)) * 100;
            const hue = scrollPercent * 3.6;
            document.documentElement.style.setProperty('--accent', `hsl(${hue}, 70%, 60%)`);
        });
    }

    // Event Handlers
    handleScroll() {
        const scrolled = window.pageYOffset;

        // Navigation background opacity
        if (this.elements.nav) {
            const opacity = Math.min(scrolled / 100, 0.95);
            this.elements.nav.style.background = `rgba(255, 255, 255, ${opacity * 0.1})`;
        }

        // Update scroll progress
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Update progress bar if exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    handleResize() {
        // Update particle canvas
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    handleLoad() {
        this.state.isLoaded = true;
        document.body.classList.add('loaded');

        // Initialize lazy loading
        this.initLazyLoading();
    }

    // Lazy Loading
    initLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');

        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.dataset.lazy;

                    if (element.tagName === 'IMG') {
                        element.src = src;
                    } else {
                        element.style.backgroundImage = `url(${src})`;
                    }

                    element.classList.add('loaded');
                    lazyObserver.unobserve(element);
                }
            });
        });

        lazyElements.forEach(el => lazyObserver.observe(el));
    }

    setupLazyLoading(card) {
        const images = card.querySelectorAll('[data-lazy]');
        images.forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.lazy;
                        image.classList.add('loaded');
                        observer.unobserve(image);
                    }
                });
            });
            observer.observe(img);
        });
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 15px 20px;
            border-radius: 10px;
            border-left: 4px solid var(--${type === 'error' ? 'red' : type === 'success' ? 'green' : 'primary'});
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // API Methods
    async loadProjects() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/projects`);
            this.state.projects = await response.json();
            this.renderProjects();
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    async loadTechStacks() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/tech-stacks`);
            this.state.techStacks = await response.json();
            this.renderTechStacks();
        } catch (error) {
            console.error('Failed to load tech stacks:', error);
        }
    }

    renderProjects() {
        if (!this.elements.projectsGrid) return;

        this.elements.projectsGrid.innerHTML = this.state.projects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-image" data-lazy="${project.image_url}">
                    ${project.icon || '🚀'}
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('')}
                </div>
                <div class="project-links">
                    ${project.demo_url ? `<a href="${project.demo_url}" class="project-link">Live Demo</a>` : ''}
                    ${project.source_url ? `<a href="${project.source_url}" class="project-link">Source Code</a>` : ''}
                </div>
            </div>
        `).join('');

        // Re-setup project cards
        this.setupProjectCards();
    }

    renderTechStacks() {
        if (!this.elements.techGrid) return;

        this.elements.techGrid.innerHTML = this.state.techStacks.map(category => `
            <div class="tech-category">
                <h3>${category.name}</h3>
                <div class="tech-tags">
                    ${category.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('')}
                </div>
            </div>
        `).join('');

        // Re-setup tech tags
        this.setupTechTags();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}