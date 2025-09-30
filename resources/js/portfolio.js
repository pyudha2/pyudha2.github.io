
class PortfolioAnimations {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    init() {
        // Configuration
        this.config = {
            animationDuration: 600,
            typewriterSpeed: 100,
            parallaxFactor: 0.5,
            scrollThreshold: 0.1,
            hoverIntensity: 10
        };

        // State management
        this.state = {
            isScrolling: false,
            currentSection: 'home',
            animationsEnabled: true,
            formSubmitting: false
        };

        // Cache DOM elements
        this.elements = this.cacheElements();

        // Initialize observers
        this.initializeObservers();
    }

    cacheElements() {
        return {
            // Navigation
            nav: document.querySelector('nav'),
            navLinks: document.querySelectorAll('nav a[href^="#"]'),

            // Sections
            sections: document.querySelectorAll('section[id]'),
            hero: document.querySelector('.hero'),
            heroTitle: document.querySelector('.hero-title'),
            heroSubtitle: document.querySelector('.hero-subtitle'),

            // Interactive elements
            fadeElements: document.querySelectorAll('.fade-in'),
            techTags: document.querySelectorAll('.tech-tag'),
            projectCards: document.querySelectorAll('.project-card'),
            floatingElements: document.querySelectorAll('.floating-element'),

            // Forms
            contactForm: document.querySelector('.contact-form'),
            submitButton: document.querySelector('.contact-form button[type="submit"]'),
            formInputs: document.querySelectorAll('.form-input'),

            // Tech categories
            techCategories: document.querySelectorAll('.tech-category'),

            // Buttons
            ctaButtons: document.querySelectorAll('.btn'),
            socialLinks: document.querySelectorAll('.social-link')
        };
    }

    initializeObservers() {
        // Intersection Observer for fade-in animations
        this.fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.triggerElementAnimation(entry.target);
                }
            });
        }, {
            threshold: this.config.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observer for section tracking
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavigation(entry.target.id);
                }
            });
        }, {
            threshold: 0.3
        });

        // Start observing
        this.elements.fadeElements.forEach(el => this.fadeObserver.observe(el));
        this.elements.sections.forEach(section => this.sectionObserver.observe(section));
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        this.setupSmoothScrolling();

        // Scroll-based effects
        this.setupScrollEffects();

        // Interactive hover effects
        this.setupHoverEffects();

        // Contact form handling
        this.setupContactForm();

        // Tech stack interactions
        this.setupTechStackInteractions();

        // Project card effects
        this.setupProjectCardEffects();

        // Button animations
        this.setupButtonAnimations();

        // Keyboard navigation
        this.setupKeyboardNavigation();

        // Window resize handling
        this.setupResizeHandling();
    }

    setupSmoothScrolling() {
        this.elements.navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    this.smoothScrollTo(target);
                    this.updateActiveNavigation(targetId.substring(1));
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80; // Account for fixed nav
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    setupScrollEffects() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallaxEffect();
                    this.updateDynamicBackground();
                    this.updateNavigationOpacity();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateParallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * this.config.parallaxFactor;

        this.elements.floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${parallax * speed}px) rotate(${parallax * 0.1}deg)`;
        });
    }

    updateDynamicBackground() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        const hue = (scrollPercent * 3.6) % 360;

        document.documentElement.style.setProperty(
            '--accent',
            `hsl(${hue}, 70%, 60%)`
        );
    }

    updateNavigationOpacity() {
        const scrollY = window.scrollY;
        const opacity = Math.min(scrollY / 100, 1);

        if (this.elements.nav) {
            this.elements.nav.style.background = `rgba(255, 255, 255, ${opacity * 0.1})`;
        }
    }

    updateActiveNavigation(activeSection) {
        this.state.currentSection = activeSection;

        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === activeSection);
        });
    }

    setupHoverEffects() {
        // Tech tag animations
        this.elements.techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.1) rotate(2deg)';
                tag.style.background = 'rgba(99, 102, 241, 0.4)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'scale(1) rotate(0deg)';
                tag.style.background = 'rgba(99, 102, 241, 0.2)';
            });
        });

        // Social link rotations
        this.elements.socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'scale(1.2) rotateY(180deg)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'scale(1) rotateY(0deg)';
            });
        });
    }

    setupProjectCardEffects() {
        this.elements.projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / this.config.hoverIntensity;
                const rotateY = (centerX - x) / this.config.hoverIntensity;

                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(10px)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    setupContactForm() {
        if (!this.elements.contactForm) return;

        this.elements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (this.state.formSubmitting) return;

            await this.handleFormSubmission(e.target);
        });

        // Real-time validation
        this.elements.formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearInputError(input));
        });
    }

    async handleFormSubmission(form) {
        this.state.formSubmitting = true;
        const button = this.elements.submitButton;
        const originalText = button.textContent;

        // Update button state
        this.updateSubmitButton('Sending...', true);

        try {
            // Prepare form data
            const formData = new FormData(form);

            // Add CSRF token for Laravel
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                formData.append('_token', csrfToken);
            }

            // Submit to Laravel backend
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                this.handleFormSuccess(form, originalText);
            } else {
                this.handleFormErrors(result.errors || { general: ['Something went wrong'] });
                this.updateSubmitButton(originalText, false);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.handleFormErrors({ general: ['Network error. Please try again.'] });
            this.updateSubmitButton(originalText, false);
        }

        this.state.formSubmitting = false;
    }

    updateSubmitButton(text, disabled) {
        const button = this.elements.submitButton;
        button.textContent = text;
        button.disabled = disabled;

        if (disabled) {
            button.style.opacity = '0.7';
            button.style.cursor = 'not-allowed';
        } else {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }

    handleFormSuccess(form, originalText) {
        const button = this.elements.submitButton;

        // Success state
        this.updateSubmitButton('Message Sent! ✅', false);
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        // Show success animation
        this.triggerSuccessAnimation();

        // Reset after delay
        setTimeout(() => {
            this.updateSubmitButton(originalText, false);
            button.style.background = 'var(--gradient)';
            form.reset();
            this.clearAllErrors();
        }, 3000);
    }

    handleFormErrors(errors) {
        this.clearAllErrors();

        Object.keys(errors).forEach(field => {
            const input = this.elements.contactForm.querySelector(`[name="${field}"]`);
            if (input) {
                this.showInputError(input, errors[field][0]);
            }
        });

        // Show general error if no specific field errors
        if (errors.general) {
            this.showGeneralError(errors.general[0]);
        }
    }

    showInputError(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';

        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        input.parentNode.appendChild(errorDiv);

        // Animate in
        setTimeout(() => {
            errorDiv.style.opacity = '1';
        }, 100);
    }

    clearInputError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';

        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearAllErrors() {
        this.elements.formInputs.forEach(input => {
            this.clearInputError(input);
        });

        const generalError = document.querySelector('.general-error');
        if (generalError) {
            generalError.remove();
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;

        let isValid = true;
        let message = '';

        // Required field validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Name validation
        if (name === 'name' && value && value.length < 2) {
            isValid = false;
            message = 'Name must be at least 2 characters';
        }

        if (!isValid) {
            this.showInputError(input, message);
        } else {
            this.clearInputError(input);
        }

        return isValid;
    }

    setupTechStackInteractions() {
        this.elements.techCategories.forEach(category => {
            category.addEventListener('mouseenter', () => {
                category.style.transform = 'translateY(-10px) scale(1.02)';
            });

            category.addEventListener('mouseleave', () => {
                category.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupButtonAnimations() {
        this.elements.ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (button.classList.contains('btn-primary')) {
                    button.style.transform = 'perspective(1000px) rotateX(-10deg) scale(1.05)';
                } else {
                    button.style.transform = 'scale(1.05)';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1) rotateX(0deg)';
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC to close any modals or reset animations
            if (e.key === 'Escape') {
                this.resetAllAnimations();
            }

            // Arrow keys for section navigation
            if (e.altKey) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateToNextSection();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateToPreviousSection();
                }
            }
        });
    }

    setupResizeHandling() {
        let resizeTimeout;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Recalculate positions and update animations
        this.resetAllAnimations();

        // Update parallax calculations
        this.updateParallaxEffect();

        // Reinitialize observers if needed
        if (window.innerWidth < 768) {
            this.disableHeavyAnimations();
        } else {
            this.enableHeavyAnimations();
        }
    }

    initializeAnimations() {
        // Typing animation for hero subtitle
        this.initTypewriterAnimation();

        // Staggered fade-in for hero elements
        this.initHeroAnimations();

        // Initial page load animations
        this.initPageLoadAnimations();
    }

    initTypewriterAnimation() {
        const subtitle = this.elements.heroSubtitle;
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--accent)';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, this.config.typewriterSpeed);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        setTimeout(typeWriter, 1500);
    }

    initHeroAnimations() {
        const heroElements = this.elements.hero.querySelectorAll('.hero-content > *');

        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    }

    initPageLoadAnimations() {
        // Animate navigation
        if (this.elements.nav) {
            this.elements.nav.style.opacity = '0';
            this.elements.nav.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                this.elements.nav.style.transition = 'all 0.6s ease';
                this.elements.nav.style.opacity = '1';
                this.elements.nav.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    triggerElementAnimation(element) {
        // Custom animations for specific elements
        if (element.classList.contains('tech-category')) {
            this.animateTechCategory(element);
        } else if (element.classList.contains('project-card')) {
            this.animateProjectCard(element);
        }
    }

    animateTechCategory(element) {
        const tags = element.querySelectorAll('.tech-tag');

        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';

            setTimeout(() => {
                tag.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, index * 100);
        });
    }

    animateProjectCard(element) {
        element.style.transform = 'translateY(30px) rotateX(-10deg)';
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = 'translateY(0) rotateX(0deg)';
            element.style.opacity = '1';
        }, 100);
    }

    triggerSuccessAnimation() {
        // Create celebration particles
        this.createParticleExplosion();

        // Pulse effect on form
        const form = this.elements.contactForm;
        form.style.animation = 'pulse 0.6s ease-in-out';

        setTimeout(() => {
            form.style.animation = '';
        }, 600);
    }

    createParticleExplosion() {
        const particles = [];
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: 50%;
                top: 50%;
            `;

            document.body.appendChild(particle);
            particles.push(particle);

            // Animate particle
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    navigateToNextSection() {
        const sections = ['home', 'about', 'projects', 'contact'];
        const currentIndex = sections.indexOf(this.state.currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        const nextSection = document.getElementById(sections[nextIndex]);

        if (nextSection) {
            this.smoothScrollTo(nextSection);
        }
    }

    navigateToPreviousSection() {
        const sections = ['home', 'about', 'projects', 'contact'];
        const currentIndex = sections.indexOf(this.state.currentSection);
        const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        const prevSection = document.getElementById(sections[prevIndex]);

        if (prevSection) {
            this.smoothScrollTo(prevSection);
        }
    }

    resetAllAnimations() {
        this.elements.projectCards.forEach(card => {
            card.style.transform = '';
        });

        this.elements.techTags.forEach(tag => {
            tag.style.transform = '';
        });
    }

    disableHeavyAnimations() {
        this.state.animationsEnabled = false;
        document.body.classList.add('reduced-motion');
    }

    enableHeavyAnimations() {
        this.state.animationsEnabled = true;
        document.body.classList.remove('reduced-motion');
    }

    // Public API methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            this.smoothScrollTo(section);
        }
    }

    updateProjectData(projects) {
        // Method to dynamically update project cards from Laravel backend
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid && projects) {
            this.renderProjects(projects, projectsGrid);
        }
    }

    updateTechStack(techData) {
        // Method to dynamically update tech stack from Laravel backend
        const techGrid = document.querySelector('.tech-grid');
        if (techGrid && techData) {
            this.renderTechStack(techData, techGrid);
        }
    }

    renderProjects(projects, container) {
        container.innerHTML = '';

        projects.forEach((project, index) => {
            const card = this.createProjectCard(project);
            container.appendChild(card);

            // Animate new cards
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });

        // Reinitialize project card effects
        this.elements.projectCards = document.querySelectorAll('.project-card');
        this.setupProjectCardEffects();
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        card.innerHTML = `
            <div class="project-image">${project.icon || '🚀'}</div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demo_url ? `<a href="${project.demo_url}" class="project-link" target="_blank">Live Demo</a>` : ''}
                ${project.source_url ? `<a href="${project.source_url}" class="project-link" target="_blank">Source Code</a>` : ''}
            </div>
        `;

        return card;
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize portfolio animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new PortfolioAnimations();
});

// Additional CSS for error states and animations
const additionalStyles = `
    .form-input.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .general-error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #ef4444;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    nav a.active::after {
        width: 100%;
    }
    
    nav a.active {
        color: var(--accent);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnimations;
}