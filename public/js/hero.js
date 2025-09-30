/**
 * Hero Section Interactive JavaScript
 * public/js/hero.js
 */

class HeroAnimations {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAnimations();
    }

    init() {
        // Configuration
        this.config = {
            typingSpeed: 100,
            glitchDuration: 300,
            parallaxSpeed: 0.5
        };

        // DOM elements cache
        this.elements = {
            heroTitle: document.getElementById('heroTitle'),
            heroSubtitle: document.getElementById('heroSubtitle'),
            ctaButtons: document.querySelectorAll('.cta-buttons .btn'),
            floatingElements: document.querySelectorAll('.floating-element'),
            bgAnimation: document.querySelector('.bg-animation')
        };

        // State
        this.state = {
            isLoaded: false,
            typingComplete: false,
            scrollY: 0
        };
    }

    bindEvents() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Hero title interactions
        if (this.elements.heroTitle) {
            this.elements.heroTitle.addEventListener('mouseenter', this.triggerGlitchEffect.bind(this));
        }

        // CTA button interactions
        this.setupButtonInteractions();

        // Smooth scrolling for navigation
        this.setupSmoothScrolling();
    }

    setupAnimations() {
        // Initialize typing animation
        this.initTypingAnimation();

        // Initialize parallax effects
        this.initParallaxEffects();

        // Initialize floating elements animation
        this.initFloatingElements();
    }

    /**
     * FIXED: Controlled glitch effect that doesn't change size
     */
    triggerGlitchEffect() {
        if (!this.elements.heroTitle) return;

        const title = this.elements.heroTitle;

        // Add glitch class for controlled shake animation
        title.classList.add('glitch');

        // Remove glitch class after animation completes
        setTimeout(() => {
            title.classList.remove('glitch');
        }, this.config.glitchDuration);
    }

    /**
     * Typing animation for hero subtitle
     */
    initTypingAnimation() {
        if (!this.elements.heroSubtitle) return;

        const subtitle = this.elements.heroSubtitle;
        const text = subtitle.textContent;

        // Clear text and prepare for typing animation
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--accent)';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, this.config.typingSpeed);
            } else {
                // Mark typing as complete and remove cursor
                this.state.typingComplete = true;
                setTimeout(() => {
                    subtitle.classList.add('typing-complete');
                    subtitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing animation after initial delay
        setTimeout(typeWriter, 1500);
    }

    /**
     * Setup button interactions with enhanced hover effects
     */
    setupButtonInteractions() {
        this.elements.ctaButtons.forEach(btn => {
            // Mouse enter effect
            btn.addEventListener('mouseenter', function () {
                if (this.classList.contains('btn-primary')) {
                    this.style.transform = 'perspective(1000px) rotateX(-5deg) scale(1.05)';
                    this.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
                } else {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 10px 20px rgba(6, 182, 212, 0.3)';
                }
            });

            // Mouse leave effect
            btn.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });

            // Click effect with ripple
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(btn, e);
            });

            // Mouse move effect for gradient following
            btn.addEventListener('mousemove', (e) => {
                this.createButtonGradientEffect(btn, e);
            });
        });
    }

    /**
     * Create ripple effect on button click
     */
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
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

        // Add ripple keyframes if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Create gradient effect that follows mouse cursor
     */
    createButtonGradientEffect(button, event) {
        if (!button.classList.contains('btn-primary')) return;

        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        button.style.background = `
            radial-gradient(circle at ${xPercent}% ${yPercent}%, 
                rgba(255,255,255,0.2) 0%, 
                transparent 70%),
            var(--gradient)
        `;
    }

    /**
     * Smooth scrolling for anchor links
     */
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

                    // Add visual feedback to clicked element
                    anchor.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        anchor.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });
    }

    /**
     * Initialize parallax effects for floating elements
     */
    initParallaxEffects() {
        // Mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;

            this.elements.floatingElements.forEach((element, index) => {
                const speed = (index + 1) * 10;
                const x = mouseX * speed;
                const y = mouseY * speed;

                element.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });

        // Scroll parallax effect
        this.updateParallaxOnScroll();
    }

    /**
     * Update parallax effects based on scroll position
     */
    updateParallaxOnScroll() {
        const scrolled = this.state.scrollY;
        const rate = scrolled * this.config.parallaxSpeed;

        // Parallax for floating elements
        this.elements.floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = rate * speed;
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });

        // Dynamic color changes based on scroll
        this.updateDynamicColors(scrolled);
    }

    /**
     * Update dynamic colors based on scroll position
     */
    updateDynamicColors(scrollY) {
        const scrollPercent = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        const hue = (scrollPercent * 3.6) % 360;

        // Update CSS custom properties
        const accentColor = `hsl(${hue}, 70%, 60%)`;
        const gradientColor = `linear-gradient(135deg, 
            hsl(${hue}, 70%, 60%), 
            hsl(${(hue + 60) % 360}, 70%, 60%), 
            hsl(${(hue + 120) % 360}, 70%, 60%))`;

        document.documentElement.style.setProperty('--accent', accentColor);
        document.documentElement.style.setProperty('--gradient', gradientColor);
    }

    /**
     * Initialize floating elements with random animations
     */
    initFloatingElements() {
        this.elements.floatingElements.forEach((element, index) => {
            // Random initial position
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            element.style.left = `${x}%`;
            element.style.top = `${y}%`;

            // Random animation delay
            element.style.animationDelay = `${Math.random() * 5}s`;

            // Random size variation
            const size = Math.random() * 5 + 8; // 8-13px
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;

            // Random opacity
            element.style.opacity = Math.random() * 0.3 + 0.2; // 0.2-0.5
        });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        this.state.scrollY = window.pageYOffset;

        // Throttle scroll updates for performance
        if (!this.scrollTimeout) {
            this.scrollTimeout = requestAnimationFrame(() => {
                this.updateParallaxOnScroll();
                this.scrollTimeout = null;
            });
        }
    }

    /**
     * Handle resize events
     */
    handleResize() {
        // Recalculate floating element positions
        this.initFloatingElements();
    }

    /**
     * Handle load events
     */
    handleLoad() {
        this.state.isLoaded = true;
        document.body.classList.add('hero-loaded');

        // Trigger initial animations
        this.triggerInitialAnimations();
    }

    /**
     * Trigger initial entry animations
     */
    triggerInitialAnimations() {
        // Add visible class to trigger CSS animations
        setTimeout(() => {
            document.querySelector('.hero-content')?.classList.add('visible');
        }, 500);

        // Stagger button animations
        this.elements.ctaButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 1200 + (index * 200));
        });
    }

    /**
     * Public method to reset all animations
     */
    resetAnimations() {
        // Reset typing animation
        if (this.elements.heroSubtitle) {
            this.elements.heroSubtitle.textContent = this.elements.heroSubtitle.dataset.originalText || '';
            this.state.typingComplete = false;
            this.initTypingAnimation();
        }

        // Reset other states
        this.state.isLoaded = false;
        document.body.classList.remove('hero-loaded');
    }

    /**
     * Public method to trigger glitch effect programmatically
     */
    glitch() {
        this.triggerGlitchEffect();
    }
}

// Initialize hero animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Store original subtitle text before initialization
    const subtitle = document.getElementById('heroSubtitle');
    if (subtitle) {
        subtitle.dataset.originalText = subtitle.textContent;
    }

    // Initialize hero animations
    window.heroAnimations = new HeroAnimations();
});

// Additional utility functions for external use
window.HeroUtils = {
    /**
     * Trigger glitch effect from external scripts
     */
    glitch: function () {
        if (window.heroAnimations) {
            window.heroAnimations.glitch();
        }
    },

    /**
     * Reset all hero animations
     */
    resetAnimations: function () {
        if (window.heroAnimations) {
            window.heroAnimations.resetAnimations();
        }
    },

    /**
     * Update hero content dynamically
     */
    updateContent: function (data) {
        const title = document.getElementById('heroTitle');
        const subtitle = document.getElementById('heroSubtitle');
        const description = document.querySelector('.hero-description');

        if (data.name && title) {
            title.textContent = data.name;
        }

        if (data.title && subtitle) {
            subtitle.textContent = data.title;
            subtitle.dataset.originalText = data.title;
        }

        if (data.description && description) {
            description.textContent = data.description;
        }

        // Re-initialize typing animation with new content
        if (window.heroAnimations) {
            window.heroAnimations.resetAnimations();
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroAnimations;
}