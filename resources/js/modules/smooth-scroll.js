/**
 * Smooth Scroll Module
 * Handles smooth scrolling behavior for navigation links and scroll-to-top functionality
 */

class SmoothScroll {
    constructor(options = {}) {
        this.options = {
            duration: 800,
            easing: 'easeInOutCubic',
            offset: 80, // Account for fixed navigation
            updateURL: true,
            ...options
        };

        this.isScrolling = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.createScrollToTop();
        this.handleInitialHash();
    }

    /**
     * Bind event listeners for smooth scroll functionality
     */
    bindEvents() {
        // Handle navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
        });

        // Handle scroll-to-top button visibility
        window.addEventListener('scroll', () => this.toggleScrollToTop());

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handlePopState());
    }

    /**
     * Handle anchor link clicks
     */
    handleAnchorClick(e) {
        e.preventDefault();

        const href = e.currentTarget.getAttribute('href');
        const targetId = href.substring(1);

        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        // Update active navigation state
        this.updateActiveNav(href);

        // Perform smooth scroll
        this.scrollToTarget(target);

        // Update URL if enabled
        if (this.options.updateURL) {
            history.pushState(null, null, href);
        }
    }

    /**
     * Scroll to target element with smooth animation
     */
    scrollToTarget(target) {
        if (this.isScrolling) return;

        this.isScrolling = true;

        const targetRect = target.getBoundingClientRect();
        const targetPosition = window.pageYOffset + targetRect.top - this.options.offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.options.duration, 1);

            const ease = this.easingFunctions[this.options.easing](progress);
            const currentPosition = startPosition + (distance * ease);

            window.scrollTo(0, currentPosition);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
                // Ensure exact final position
                window.scrollTo(0, targetPosition);

                // Dispatch custom event
                this.dispatchScrollComplete(target);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /**
     * Update active navigation state
     */
    updateActiveNav(activeHref) {
        // Remove active class from all nav links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            // Reset any custom active styles
            link.style.opacity = '';
        });

        // Add active class to current link
        const activeLink = document.querySelector(`nav a[href="${activeHref}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.style.opacity = '1';
        }
    }

    /**
     * Create scroll-to-top button
     */
    createScrollToTop() {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');

        // Style the button
        Object.assign(scrollTopBtn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--gradient)',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: '1000',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        });

        // Add hover effects
        scrollTopBtn.addEventListener('mouseenter', () => {
            scrollTopBtn.style.transform = 'scale(1.1)';
            scrollTopBtn.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.4)';
        });

        scrollTopBtn.addEventListener('mouseleave', () => {
            scrollTopBtn.style.transform = 'scale(1)';
            scrollTopBtn.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        });

        // Add click handler
        scrollTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });

        document.body.appendChild(scrollTopBtn);
        this.scrollTopBtn = scrollTopBtn;
    }

    /**
     * Toggle scroll-to-top button visibility
     */
    toggleScrollToTop() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;

        if (scrollPosition > windowHeight * 0.3) {
            this.scrollTopBtn.style.opacity = '1';
            this.scrollTopBtn.style.visibility = 'visible';
        } else {
            this.scrollTopBtn.style.opacity = '0';
            this.scrollTopBtn.style.visibility = 'hidden';
        }
    }

    /**
     * Scroll to top of page
     */
    scrollToTop() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        const startPosition = window.pageYOffset;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.options.duration, 1);

            const ease = this.easingFunctions[this.options.easing](progress);
            const currentPosition = startPosition * (1 - ease);

            window.scrollTo(0, currentPosition);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
                window.scrollTo(0, 0);

                // Update URL and navigation
                if (this.options.updateURL) {
                    history.pushState(null, null, '#home');
                }
                this.updateActiveNav('#home');
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /**
     * Handle initial page load with hash
     */
    handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            // Delay to ensure page is fully loaded
            setTimeout(() => {
                const target = document.querySelector(hash);
                if (target) {
                    this.scrollToTarget(target);
                    this.updateActiveNav(hash);
                }
            }, 100);
        } else {
            this.updateActiveNav('#home');
        }
    }

    /**
     * Handle browser back/forward navigation
     */
    handlePopState() {
        const hash = window.location.hash || '#home';
        const target = document.querySelector(hash);

        if (target) {
            this.scrollToTarget(target);
            this.updateActiveNav(hash);
        }
    }

    /**
     * Dispatch custom scroll complete event
     */
    dispatchScrollComplete(target) {
        const event = new CustomEvent('scrollComplete', {
            detail: { target }
        });
        document.dispatchEvent(event);
    }

    /**
     * Update active section based on scroll position
     */
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + this.options.offset + 50;

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = `#${section.id}`;
            }
        });

        if (currentSection) {
            this.updateActiveNav(currentSection);

            // Update URL without triggering scroll
            if (this.options.updateURL && !this.isScrolling) {
                history.replaceState(null, null, currentSection);
            }
        }
    }

    /**
     * Enable active section tracking on scroll
     */
    enableActiveTracking() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking && !this.isScrolling) {
                requestAnimationFrame(() => {
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Easing functions for smooth animations
     */
    easingFunctions = {
        easeInOutCubic: (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        easeOutCubic: (t) => {
            return 1 - Math.pow(1 - t, 3);
        },
        easeInCubic: (t) => {
            return t * t * t;
        },
        easeInOutQuad: (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        linear: (t) => {
            return t;
        }
    };

    /**
     * Destroy the smooth scroll instance
     */
    destroy() {
        // Remove event listeners
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.removeEventListener('click', this.handleAnchorClick);
        });

        // Remove scroll-to-top button
        if (this.scrollTopBtn) {
            this.scrollTopBtn.remove();
        }

        // Reset navigation states
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            link.style.opacity = '';
        });
    }
}

// Auto-initialize with default options
let smoothScrollInstance = null;

const initSmoothScroll = (options = {}) => {
    if (smoothScrollInstance) {
        smoothScrollInstance.destroy();
    }

    smoothScrollInstance = new SmoothScroll(options);

    // Enable active section tracking
    smoothScrollInstance.enableActiveTracking();

    return smoothScrollInstance;
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initSmoothScroll());
} else {
    initSmoothScroll();
}

// Export for module usage
export { SmoothScroll, initSmoothScroll };
export default SmoothScroll;