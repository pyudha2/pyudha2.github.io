/**
 * Portfolio Animation System
 * Handles all animations and visual effects for the Alex Chen portfolio
 */

class PortfolioAnimations {
    constructor() {
        this.isInitialized = false;
        this.observers = [];
        this.animationFrames = [];
        this.scrollPosition = 0;
        this.ticking = false;

        this.init();
    }

    /**
     * Initialize all animation systems
     */
    init() {
        if (this.isInitialized) return;

        this.setupScrollAnimations();
        this.setupHeroAnimations();
        this.setupParallaxEffects();
        this.setupMorphingBackground();
        this.setupProjectCardEffects();
        this.setupTechTagAnimations();
        this.setupNavigationEffects();
        this.setupFloatingElements();
        this.setupGlowEffects();
        this.setupColorTransitions();

        this.isInitialized = true;
        console.log('🎨 Portfolio animations initialized');
    }

    /**
     * Scroll-triggered animations using Intersection Observer
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '-10% 0px -20% 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const ratio = entry.intersectionRatio;

                if (entry.isIntersecting && ratio > 0.1) {
                    element.classList.add('visible');
                    this.triggerElementAnimation(element, ratio);
                } else if (ratio === 0) {
                    element.classList.remove('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in, .tech-category, .project-card').forEach(el => {
            fadeInObserver.observe(el);
        });

        this.observers.push(fadeInObserver);
    }

    /**
     * Hero section animations
     */
    setupHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const ctaButtons = document.querySelector('.cta-buttons');

        // Enhanced title glow animation
        if (heroTitle) {
            this.createPulsingGlow(heroTitle);
            this.createTextShimmer(heroTitle);
        }

        // Typewriter effect for subtitle
        if (heroSubtitle) {
            this.createTypewriterEffect(heroSubtitle, 80);
        }

        // Staggered fade-in for description and buttons
        this.staggeredFadeIn([heroDescription, ctaButtons], 300);

        // Floating animation for hero content
        this.createFloatingAnimation('.hero-content', 3000, 20);
    }

    /**
     * Parallax effects for various elements
     */
    setupParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const rateTwo = scrolled * -0.25;
            const rateFast = scrolled * -0.75;

            // Background elements
            const bgAnimation = document.querySelector('.bg-animation');
            if (bgAnimation) {
                bgAnimation.style.transform = `translate3d(0, ${rate}px, 0)`;
            }

            // Floating elements with different speeds
            document.querySelectorAll('.floating-element').forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                const yPos = scrolled * speed;
                const rotation = (scrolled * speed) % 360;

                element.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
            });

            // Hero content parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const heroOffset = scrolled * 0.3;
                heroContent.style.transform = `translate3d(0, ${heroOffset}px, 0)`;
            }

            ticking = false;
        };

        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }

    /**
     * Morphing background with dynamic gradients
     */
    setupMorphingBackground() {
        let hue = 240; // Start with blue
        const saturation = 70;
        const lightness = 60;

        const morphBackground = () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            hue = (240 + scrollPercent * 2) % 360;

            const primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            const secondary = `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness - 10}%)`;
            const accent = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness + 10}%)`;

            document.documentElement.style.setProperty('--primary', primary);
            document.documentElement.style.setProperty('--secondary', secondary);
            document.documentElement.style.setProperty('--accent', accent);

            // Update gradient
            const gradient = `linear-gradient(135deg, ${primary}, ${secondary}, ${accent})`;
            document.documentElement.style.setProperty('--gradient', gradient);
        };

        let morphTicking = false;
        window.addEventListener('scroll', () => {
            if (!morphTicking) {
                requestAnimationFrame(morphBackground);
                morphTicking = true;
                setTimeout(() => morphTicking = false, 16);
            }
        }, { passive: true });
    }

    /**
     * 3D project card effects
     */
    setupProjectCardEffects() {
        document.querySelectorAll('.project-card').forEach(card => {
            // 3D hover effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * 15;
                const rotateY = ((centerX - x) / centerX) * 15;

                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                    scale(1.02)
                `;

                // Add light reflection effect
                this.createReflectionEffect(card, x, y, rect);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
                this.removeReflectionEffect(card);
            });

            // Staggered reveal animation
            card.addEventListener('mouseenter', () => {
                this.animateCardContent(card);
            });
        });
    }

    /**
     * Tech tag interactive animations
     */
    setupTechTagAnimations() {
        document.querySelectorAll('.tech-tag').forEach(tag => {
            // Elastic hover effect
            tag.addEventListener('mouseenter', () => {
                const randomRotation = (Math.random() - 0.5) * 10;
                tag.style.transform = `scale(1.15) rotate(${randomRotation}deg)`;
                tag.style.background = 'rgba(99, 102, 241, 0.4)';

                // Add ripple effect
                this.createRippleEffect(tag);
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'scale(1) rotate(0deg)';
                tag.style.background = 'rgba(99, 102, 241, 0.2)';
            });

            // Random floating animation
            this.addRandomFloat(tag);
        });
    }

    /**
     * Navigation effects
     */
    setupNavigationEffects() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Smooth scale on hover
        nav.addEventListener('mouseenter', () => {
            nav.style.transform = 'translateX(-50%) scale(1.05)';
        });

        nav.addEventListener('mouseleave', () => {
            nav.style.transform = 'translateX(-50%) scale(1)';
        });

        // Active link highlighting
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.createLinkClickEffect(link);
            });
        });

        // Hide/show nav on scroll
        this.setupSmartNavigation(nav);
    }

    /**
     * Floating elements animation
     */
    setupFloatingElements() {
        document.querySelectorAll('.floating-element').forEach((element, index) => {
            const duration = 3000 + (index * 500);
            const delay = index * 200;
            const amplitude = 20 + (index * 10);

            this.createFloatingAnimation(element, duration, amplitude, delay);

            // Add random color changes
            setInterval(() => {
                const hue = Math.random() * 360;
                element.style.background = `hsl(${hue}, 70%, 60%)`;
                element.style.boxShadow = `0 0 20px hsla(${hue}, 70%, 60%, 0.5)`;
            }, 5000 + (index * 1000));
        });
    }

    /**
     * Glow effects for various elements
     */
    setupGlowEffects() {
        // Button glow on hover
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.createGlowPulse(btn);
            });
        });

        // Section title glow
        document.querySelectorAll('.section-title').forEach(title => {
            this.createPulsingGlow(title);
        });
    }

    /**
     * Color transition system
     */
    setupColorTransitions() {
        const colorShift = () => {
            const time = Date.now() * 0.001;
            const hue1 = (Math.sin(time * 0.3) * 60 + 240) % 360;
            const hue2 = (Math.sin(time * 0.2) * 60 + 280) % 360;
            const hue3 = (Math.sin(time * 0.4) * 60 + 200) % 360;

            const gradient = `linear-gradient(135deg, 
                hsl(${hue1}, 70%, 60%), 
                hsl(${hue2}, 70%, 50%), 
                hsl(${hue3}, 70%, 65%)
            )`;

            document.documentElement.style.setProperty('--dynamic-gradient', gradient);
        };

        setInterval(colorShift, 100);
    }

    // ============ UTILITY METHODS ============

    /**
     * Create typewriter effect
     */
    createTypewriterEffect(element, speed = 100) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';

        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, speed);
    }

    /**
     * Create pulsing glow effect
     */
    createPulsingGlow(element) {
        element.style.animation = 'glow 2s ease-in-out infinite alternate';
    }

    /**
     * Create floating animation
     */
    createFloatingAnimation(selector, duration = 3000, amplitude = 20, delay = 0) {
        const elements = typeof selector === 'string' ?
            document.querySelectorAll(selector) : [selector];

        elements.forEach(element => {
            if (!element) return;

            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp + delay;
                const progress = ((timestamp - start) / duration) % 1;
                const yOffset = Math.sin(progress * Math.PI * 2) * amplitude;

                element.style.transform += ` translateY(${yOffset}px)`;

                this.animationFrames.push(requestAnimationFrame(animate));
            };

            this.animationFrames.push(requestAnimationFrame(animate));
        });
    }

    /**
     * Create staggered fade-in animation
     */
    staggeredFadeIn(elements, delay = 200) {
        elements.forEach((element, index) => {
            if (!element) return;

            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    /**
     * Create ripple effect
     */
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Create reflection effect on cards
     */
    createReflectionEffect(card, x, y, rect) {
        let reflection = card.querySelector('.reflection');
        if (!reflection) {
            reflection = document.createElement('div');
            reflection.className = 'reflection';
            reflection.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at ${x}px ${y}px, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    transparent 50%);
                pointer-events: none;
                border-radius: inherit;
            `;
            card.appendChild(reflection);
        } else {
            reflection.style.background = `
                radial-gradient(circle at ${x}px ${y}px, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    transparent 50%)
            `;
        }
    }

    /**
     * Remove reflection effect
     */
    removeReflectionEffect(card) {
        const reflection = card.querySelector('.reflection');
        if (reflection) {
            reflection.remove();
        }
    }

    /**
     * Animate card content on hover
     */
    animateCardContent(card) {
        const title = card.querySelector('.project-title');
        const description = card.querySelector('.project-description');
        const tags = card.querySelectorAll('.tech-tag');
        const links = card.querySelectorAll('.project-link');

        [title, description, ...tags, ...links].forEach((el, index) => {
            if (!el) return;

            el.style.transform = 'translateY(5px)';
            el.style.opacity = '0.8';

            setTimeout(() => {
                el.style.transition = 'all 0.3s ease';
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, index * 50);
        });
    }

    /**
     * Add random floating to elements
     */
    addRandomFloat(element) {
        const duration = 2000 + Math.random() * 3000;
        const amplitude = 5 + Math.random() * 10;
        const delay = Math.random() * 1000;

        this.createFloatingAnimation(element, duration, amplitude, delay);
    }

    /**
     * Create glow pulse effect
     */
    createGlowPulse(element) {
        element.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
        element.style.transition = 'box-shadow 0.3s ease';
    }

    /**
     * Smart navigation show/hide
     */
    setupSmartNavigation(nav) {
        let lastScrollY = window.scrollY;
        let scrollDirection = 'up';

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

            if (scrollDirection === 'down' && currentScrollY > 100) {
                nav.style.transform = 'translateX(-50%) translateY(-100px) scale(0.9)';
                nav.style.opacity = '0';
            } else {
                nav.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                nav.style.opacity = '1';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    /**
     * Create link click effect
     */
    createLinkClickEffect(link) {
        link.style.transform = 'scale(1.1)';
        link.style.color = 'var(--accent)';

        setTimeout(() => {
            link.style.transform = 'scale(1)';
            link.style.color = 'var(--text-primary)';
        }, 200);
    }

    /**
     * Trigger element animation based on intersection ratio
     */
    triggerElementAnimation(element, ratio) {
        const delay = Math.random() * 200;

        setTimeout(() => {
            element.style.transform = `translateY(0) scale(${0.95 + ratio * 0.05})`;
            element.style.opacity = ratio;
        }, delay);
    }

    /**
     * Create text shimmer effect
     */
    createTextShimmer(element) {
        element.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)';
        element.style.backgroundSize = '200% 100%';
        element.style.animation = 'shimmer 3s infinite';

        // Add shimmer keyframes if not exists
        if (!document.querySelector('#shimmer-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shimmer-keyframes';
            style.textContent = `
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes ripple {
                    to { transform: scale(4); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Cleanup animations
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.animationFrames.forEach(frame => cancelAnimationFrame(frame));
        this.observers = [];
        this.animationFrames = [];
        this.isInitialized = false;
    }

    /**
     * Reset all animations
     */
    reset() {
        this.cleanup();
        setTimeout(() => this.init(), 100);
    }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioAnimations = new PortfolioAnimations();
    });
} else {
    window.portfolioAnimations = new PortfolioAnimations();
}

// Export for module usage
export default PortfolioAnimations;