/**
 * Intersection Observer Module
 * Handles scroll-triggered animations and effects for the portfolio
 */

class IntersectionObserverManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isInitialized = false;

        // Default observer options
        this.defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    /**
     * Initialize all intersection observers
     */
    init() {
        if (this.isInitialized) return;

        this.setupFadeInObserver();
        this.setupTechStackObserver();
        this.setupProjectCardsObserver();
        this.setupNavHighlightObserver();
        this.setupCounterObserver();
        this.setupParallaxObserver();

        this.isInitialized = true;
    }

    /**
     * Generic fade-in animation observer
     */
    setupFadeInObserver() {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple elements
                    const delay = entry.target.dataset.delay || index * 150;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        this.triggerCustomAnimation(entry.target);
                    }, delay);

                    // Unobserve after animation to improve performance
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, this.defaultOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            el.dataset.delay = index * 100; // Staggered animation
            fadeInObserver.observe(el);
        });

        this.observers.set('fadeIn', fadeInObserver);
    }

    /**
     * Tech stack animation observer with enhanced effects
     */
    setupTechStackObserver() {
        const techStackObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const techTags = entry.target.querySelectorAll('.tech-tag');

                    techTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.animation = `slideInScale 0.6s ease ${index * 80}ms both`;
                        }, 200);
                    });

                    techStackObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('.tech-category').forEach(category => {
            techStackObserver.observe(category);
        });

        this.observers.set('techStack', techStackObserver);
    }

    /**
     * Project cards observer with 3D reveal effects
     */
    setupProjectCardsObserver() {
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const image = card.querySelector('.project-image');
                    const title = card.querySelector('.project-title');
                    const description = card.querySelector('.project-description');
                    const techTags = card.querySelectorAll('.tech-tag');
                    const links = card.querySelectorAll('.project-link');

                    // Animate card entrance
                    card.style.animation = 'cardReveal 0.8s ease both';

                    // Staggered content animation
                    setTimeout(() => {
                        if (image) image.style.animation = 'scaleIn 0.6s ease both';
                    }, 200);

                    setTimeout(() => {
                        if (title) title.style.animation = 'fadeInUp 0.6s ease both';
                    }, 400);

                    setTimeout(() => {
                        if (description) description.style.animation = 'fadeInUp 0.6s ease both';
                    }, 600);

                    // Tech tags animation
                    techTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.animation = 'tagPop 0.4s ease both';
                        }, 800 + (index * 100));
                    });

                    // Links animation
                    links.forEach((link, index) => {
                        setTimeout(() => {
                            link.style.animation = 'slideInRight 0.5s ease both';
                        }, 1200 + (index * 150));
                    });

                    projectObserver.unobserve(card);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -80px 0px'
        });

        document.querySelectorAll('.project-card').forEach(card => {
            projectObserver.observe(card);
        });

        this.observers.set('projects', projectObserver);
    }

    /**
     * Navigation highlight observer for active section tracking
     */
    setupNavHighlightObserver() {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);

                if (entry.isIntersecting && navLink) {
                    // Remove active class from all nav links
                    document.querySelectorAll('nav a').forEach(link => {
                        link.classList.remove('active');
                    });

                    // Add active class to current section
                    navLink.classList.add('active');

                    // Update nav background based on section
                    this.updateNavTheme(entry.target.id);
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '-20% 0px -20% 0px'
        });

        // Observe all main sections
        document.querySelectorAll('section[id]').forEach(section => {
            navObserver.observe(section);
        });

        this.observers.set('navigation', navObserver);
    }

    /**
     * Counter/stats animation observer
     */
    setupCounterObserver() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('[data-count]');

                    counters.forEach(counter => {
                        this.animateCounter(counter);
                    });

                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.8
        });

        // Look for elements with counter data
        document.querySelectorAll('[data-count]').forEach(counter => {
            counterObserver.observe(counter.closest('section') || counter);
        });

        this.observers.set('counters', counterObserver);
    }

    /**
     * Parallax effects observer
     */
    setupParallaxObserver() {
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('parallax-active');
                    this.startParallaxTracking(entry.target);
                } else {
                    entry.target.classList.remove('parallax-active');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '100px 0px 100px 0px'
        });

        document.querySelectorAll('[data-parallax]').forEach(element => {
            parallaxObserver.observe(element);
        });

        this.observers.set('parallax', parallaxObserver);
    }

    /**
     * Trigger custom animations based on element data attributes
     */
    triggerCustomAnimation(element) {
        const animationType = element.dataset.animation;
        const duration = element.dataset.duration || '0.6s';
        const delay = element.dataset.animationDelay || '0s';

        if (animationType) {
            element.style.animation = `${animationType} ${duration} ease ${delay} both`;
        }

        // Trigger any custom events
        element.dispatchEvent(new CustomEvent('elementVisible', {
            detail: { element, timestamp: Date.now() }
        }));
    }

    /**
     * Update navigation theme based on current section
     */
    updateNavTheme(sectionId) {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Remove existing theme classes
        nav.classList.remove('nav-home', 'nav-about', 'nav-projects', 'nav-contact');

        // Add theme class for current section
        nav.classList.add(`nav-${sectionId}`);
    }

    /**
     * Animate counter/stats numbers
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.count) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';

        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;

            if (start >= target) {
                element.textContent = prefix + target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                element.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
            }
        }, 16);
    }

    /**
     * Start parallax tracking for element
     */
    startParallaxTracking(element) {
        const speed = parseFloat(element.dataset.parallax) || 0.5;

        const updateParallax = () => {
            if (!element.classList.contains('parallax-active')) return;

            const rect = element.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const parallax = scrolled * speed;

            element.style.transform = `translateY(${parallax}px)`;

            requestAnimationFrame(updateParallax);
        };

        requestAnimationFrame(updateParallax);
    }

    /**
     * Add reveal animation to specific element
     */
    revealElement(selector, options = {}) {
        const element = document.querySelector(selector);
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    if (options.callback) {
                        options.callback(entry.target);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px'
        });

        observer.observe(element);
        return observer;
    }

    /**
     * Progressive image loading observer
     */
    setupLazyImageObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;

                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    }

                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        this.observers.set('lazyImages', imageObserver);
    }

    /**
     * Cleanup all observers
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animationQueue = [];
        this.isInitialized = false;
    }

    /**
     * Refresh observers (useful for dynamic content)
     */
    refresh() {
        this.destroy();
        setTimeout(() => this.init(), 100);
    }
}

// CSS animations (inject into document)
const animationStyles = `
    @keyframes slideInScale {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes cardReveal {
        from {
            opacity: 0;
            transform: translateY(50px) rotateX(-15deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
        }
    }

    @keyframes scaleIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes tagPop {
        from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(30px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Navigation active states */
    nav a.active::after {
        width: 100%;
        background: var(--accent);
    }

    nav.nav-home {
        background: rgba(99, 102, 241, 0.1);
    }

    nav.nav-about {
        background: rgba(139, 92, 246, 0.1);
    }

    nav.nav-projects {
        background: rgba(6, 182, 212, 0.1);
    }

    nav.nav-contact {
        background: rgba(16, 185, 129, 0.1);
    }

    /* Lazy loading images */
    img[data-src] {
        filter: blur(5px);
        transition: filter 0.3s ease;
    }

    img.loaded {
        filter: blur(0);
    }

    /* Revealed elements */
    .revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Create and export singleton instance
const intersectionObserverManager = new IntersectionObserverManager();

export default intersectionObserverManager;

// Also export the class for custom instances
export { IntersectionObserverManager };