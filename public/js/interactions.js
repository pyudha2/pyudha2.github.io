/**
 * Portfolio Interactive Features
 * Handles all animations, interactions, and dynamic behaviors
 */

class PortfolioInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupNavigationEffects();
        this.setupHeroAnimations();
        this.setupTechStackInteractions();
        this.setupProjectCardEffects();
        this.setupContactForm();
        this.setupParallaxEffects();
        this.setupDynamicBackground();
        this.setupFloatingElements();
        this.setupPerformanceOptimizations();
    }

    /**
     * Smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    // Add active state to navigation
                    this.updateActiveNavigation(targetId);

                    // Smooth scroll with custom easing
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Add ripple effect to clicked nav item
                    this.createRippleEffect(anchor, e);
                }
            });
        });
    }

    /**
     * Update active navigation item
     */
    updateActiveNavigation(targetId) {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`nav a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Create ripple effect on click
     */
    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Scroll-based animations with Intersection Observer
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Add stagger animation for child elements
                    const children = entry.target.querySelectorAll('.tech-category, .project-card, .tech-tag');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Setup scroll progress indicator
        this.setupScrollProgress();
    }

    /**
     * Scroll progress indicator
     */
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    /**
     * Navigation hover effects and sticky behavior
     */
    setupNavigationEffects() {
        const nav = document.querySelector('nav');
        let lastScrollY = window.scrollY;

        // Sticky navigation with hide/show effect
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                nav.classList.add('scrolled');

                if (currentScrollY > lastScrollY) {
                    nav.style.transform = 'translateX(-50%) translateY(-100%)';
                } else {
                    nav.style.transform = 'translateX(-50%) translateY(0)';
                }
            } else {
                nav.classList.remove('scrolled');
                nav.style.transform = 'translateX(-50%) translateY(0)';
            }

            lastScrollY = currentScrollY;
        });

        // Enhanced hover effects for navigation items
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
                this.style.textShadow = '0 4px 8px rgba(99, 102, 241, 0.4)';
            });

            link.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.textShadow = 'none';
            });
        });
    }

    /**
     * Hero section animations
     */
    setupHeroAnimations() {
        // Typing animation for subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.style.borderRight = '2px solid var(--accent)';

            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        subtitle.style.borderRight = 'none';
                    }, 1000);
                }
            };

            setTimeout(typeWriter, 1500);
        }

        // Hero title glitch effect on hover
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.addEventListener('mouseenter', () => {
                this.createGlitchEffect(heroTitle);
            });
        }

        // Animated hero buttons
        document.querySelectorAll('.cta-buttons .btn').forEach(btn => {
            btn.addEventListener('mouseenter', function () {
                this.style.transform = this.classList.contains('btn-primary')
                    ? 'perspective(1000px) rotateX(-10deg) scale(1.05)'
                    : 'scale(1.05)';
            });

            btn.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Create glitch effect
     */
    createGlitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;

        const glitchInterval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(glitchInterval);
            }

            iterations += 1 / 3;
        }, 30);
    }

    /**
     * Tech stack interactive elements
     */
    setupTechStackInteractions() {
        // Tech category cards hover effects
        document.querySelectorAll('.tech-category').forEach(category => {
            category.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';

                // Animate tech tags within the category
                const tags = this.querySelectorAll('.tech-tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.transform = 'scale(1.1) rotate(2deg)';
                    }, index * 50);
                });
            });

            category.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';

                const tags = this.querySelectorAll('.tech-tag');
                tags.forEach(tag => {
                    tag.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        });

        // Individual tech tag interactions
        document.querySelectorAll('.tech-tag').forEach(tag => {
            // Pulse animation on click
            tag.addEventListener('click', function () {
                this.style.animation = 'pulse 0.3s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);

                // Show tech info tooltip
                this.showTechTooltip(tag);
            });

            // Magnetic effect
            tag.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            });

            tag.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    /**
     * Show technology tooltip
     */
    showTechTooltip(element) {
        const tech = element.textContent;
        const descriptions = {
            'Laravel 12': 'PHP web framework for rapid development',
            'React 18': 'JavaScript library for building user interfaces',
            'Node.js': 'JavaScript runtime for server-side development',
            'TypeScript': 'Typed superset of JavaScript',
            'PostgreSQL': 'Advanced open-source relational database',
            'MongoDB': 'NoSQL document-oriented database',
            'AWS': 'Amazon Web Services cloud platform',
            'Docker': 'Containerization platform',
            // Add more descriptions as needed
        };

        const description = descriptions[tech] || 'Cutting-edge technology';

        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = description;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.8rem;
            color: var(--text-primary);
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(0)';

        document.body.appendChild(tooltip);

        // Animate in
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        // Remove after delay
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }

    /**
     * Project cards 3D effects and interactions
     */
    setupProjectCardEffects() {
        document.querySelectorAll('.project-card').forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                this.style.boxShadow = '0 30px 60px rgba(99, 102, 241, 0.2)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            });

            // Project image hover effect
            const projectImage = card.querySelector('.project-image');
            if (projectImage) {
                card.addEventListener('mouseenter', () => {
                    projectImage.style.transform = 'scale(1.1) rotate(5deg)';
                    projectImage.style.filter = 'brightness(1.2)';
                });

                card.addEventListener('mouseleave', () => {
                    projectImage.style.transform = 'scale(1) rotate(0deg)';
                    projectImage.style.filter = 'brightness(1)';
                });
            }

            // Project links hover effects
            card.querySelectorAll('.project-link').forEach(link => {
                link.addEventListener('mouseenter', function () {
                    this.style.transform = 'scale(1.05) translateY(-2px)';
                    this.style.boxShadow = '0 5px 15px rgba(6, 182, 212, 0.3)';
                });

                link.addEventListener('mouseleave', function () {
                    this.style.transform = 'scale(1) translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
        });

        // Project filter functionality (if categories exist)
        this.setupProjectFilters();
    }

    /**
     * Setup project filtering
     */
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.project-filter');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                const filter = this.dataset.filter;

                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter projects
                document.querySelectorAll('.project-card').forEach(card => {
                    const categories = card.dataset.categories?.split(',') || [];

                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';

                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /**
     * Contact form interactions
     */
    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        // Form field focus effects
        form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            });

            input.addEventListener('blur', function () {
                this.parentElement.classList.remove('focused');
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });

            // Floating labels
            input.addEventListener('input', function () {
                if (this.value) {
                    this.parentElement.classList.add('has-content');
                } else {
                    this.parentElement.classList.remove('has-content');
                }
            });
        });

        // Form submission with animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Character counter for textarea
        const textarea = form.querySelector('textarea');
        if (textarea) {
            this.setupCharacterCounter(textarea);
        }
    }

    /**
     * Handle form submission with animations
     */
    handleFormSubmission(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        // Disable form and show loading
        button.disabled = true;
        button.innerHTML = `
            <span class="loading-spinner"></span>
            Sending...
        `;
        button.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';

        // Add loading spinner styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top: 2px solid white;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Simulate form submission
        setTimeout(() => {
            // Success state
            button.innerHTML = '✅ Message Sent!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            // Show success message
            this.showNotification('Message sent successfully!', 'success');

            // Reset form after delay
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
                button.style.background = 'var(--gradient)';
                form.reset();

                // Remove has-content class from form groups
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('has-content');
                });
            }, 2000);

            // Remove spinner styles
            style.remove();
        }, 2000);
    }

    /**
     * Setup character counter for textarea
     */
    setupCharacterCounter(textarea) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-size: 0.8rem;
            color: var(--text-secondary);
            pointer-events: none;
        `;

        textarea.parentElement.style.position = 'relative';
        textarea.parentElement.appendChild(counter);

        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining}/${maxLength}`;

            if (remaining < 50) {
                counter.style.color = '#ef4444';
            } else if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        };

        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Parallax effects for floating elements
     */
    setupParallaxEffects() {
        const floatingElements = document.querySelectorAll('.floating-element');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;

            floatingElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                const yPos = parallax * speed;
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        });

        // Add mouse move parallax for floating elements
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;

            floatingElements.forEach((element, index) => {
                const speed = (index + 1) * 20;
                element.style.transform += ` translate(${mouseX * speed}px, ${mouseY * speed}px)`;
            });
        });
    }

    /**
     * Dynamic background color changes
     */
    setupDynamicBackground() {
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            const hue = scrollPercent * 3.6; // Full color wheel

            document.documentElement.style.setProperty('--accent', `hsl(${hue}, 70%, 60%)`);

            // Update floating elements color
            document.querySelectorAll('.floating-element').forEach(element => {
                element.style.background = `hsl(${hue + 60}, 70%, 60%)`;
            });
        });
    }

    /**
     * Enhanced floating elements
     */
    setupFloatingElements() {
        // Create additional floating elements dynamically
        const container = document.querySelector('.floating-elements');
        if (!container) return;

        // Create more floating elements
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element dynamic';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 15 + 5}px;
                height: ${Math.random() * 15 + 5}px;
                background: var(--accent);
                border-radius: 50%;
                opacity: ${Math.random() * 0.3 + 0.1};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float-random ${Math.random() * 10 + 10}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;

            container.appendChild(element);
        }
    }

    /**
     * Performance optimizations
     */
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        const originalScrollHandlers = [];

        // Collect existing scroll handlers and replace with throttled versions
        this.throttleScrollEvents();

        // Lazy load images
        this.setupLazyLoading();

        // Preload critical resources
        this.preloadResources();
    }

    /**
     * Throttle scroll events for better performance
     */
    throttleScrollEvents() {
        let ticking = false;

        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Execute scroll handlers here
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Replace scroll events with throttled version
        window.addEventListener('scroll', throttledScroll, { passive: true });
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Preload critical resources
     */
    preloadResources() {
        // Preload critical fonts and images
        const criticalResources = [
            '/fonts/inter.woff2',
            '/images/hero-bg.jpg',
            // Add more critical resources
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.woff') ? 'font' : 'image';
            if (link.as === 'font') link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
}

// Social links hover effects
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.2) rotateY(180deg)';
            this.style.background = 'var(--gradient)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotateY(0deg)';
            this.style.background = 'var(--glass)';
        });
    });
});

// Add required CSS for animations
const additionalStyles = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .scroll-progress {
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
    }
    
    .tech-tooltip {
        transform: translateX(-50%);
    }
    
    nav.scrolled {
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
    }
    
    .form-group.focused .form-input {
        border-color: var(--primary);
    }
    
    .form-group.has-content .form-input {
        border-color: var(--accent);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize portfolio interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioInteractions();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioInteractions;
}