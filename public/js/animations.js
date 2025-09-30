class PortfolioAnimations {
    constructor() {
        this.init();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupDynamicBackgrounds();
        this.setupTypingAnimations();
        this.setupProjectCard3D();
        this.setupTechTagAnimations();
        this.setupFloatingElements();
    }

    init() {
        // Initialize intersection observer for scroll animations
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.triggerAnimationSequence(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }

    setupScrollAnimations() {
        let ticking = false;
        let lastScrollY = window.scrollY;

        const updateAnimations = () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            const scrollPercent = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

            // Update CSS custom properties for scroll-based animations
            document.documentElement.style.setProperty('--scroll-y', scrollY + 'px');
            document.documentElement.style.setProperty('--scroll-percent', scrollPercent + '%');

            // Animate navigation based on scroll
            this.animateNavigation(scrollY, scrollDirection);

            // Update floating background elements
            this.updateFloatingElements(scrollY);

            // Dynamic color transitions
            this.updateDynamicColors(scrollPercent);

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
    }

    animateNavigation(scrollY, direction) {
        const nav = document.querySelector('nav');
        if (!nav) return;

        if (scrollY > 100) {
            nav.style.transform = `translateX(-50%) translateY(${direction === 'down' ? '-100%' : '0'})`;
            nav.style.background = 'rgba(15, 23, 42, 0.9)';
            nav.style.backdropFilter = 'blur(30px)';
        } else {
            nav.style.transform = 'translateX(-50%) translateY(0)';
            nav.style.background = 'rgba(255, 255, 255, 0.1)';
            nav.style.backdropFilter = 'blur(20px)';
        }
    }

    updateFloatingElements(scrollY) {
        const parallaxMultiplier = 0.5;

        document.querySelectorAll('.floating-element').forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = scrollY * parallaxMultiplier * speed;
            const rotation = scrollY * 0.1 * (index + 1);

            element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            element.style.opacity = Math.max(0.1, 0.5 - (scrollY * 0.001));
        });
    }

    updateDynamicColors(scrollPercent) {
        const hue = (scrollPercent * 3.6) % 360;
        const accentColor = `hsl(${hue}, 70%, 60%)`;
        const gradientColor = `linear-gradient(135deg, 
            hsl(${hue}, 70%, 60%), 
            hsl(${(hue + 60) % 360}, 70%, 60%), 
            hsl(${(hue + 120) % 360}, 70%, 60%))`;

        document.documentElement.style.setProperty('--accent', accentColor);
        document.documentElement.style.setProperty('--gradient', gradientColor);
    }

    setupHoverEffects() {
        // Enhanced button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', this.buttonHoverEnter.bind(this));
            btn.addEventListener('mouseleave', this.buttonHoverLeave.bind(this));
            btn.addEventListener('mousemove', this.buttonMouseMove.bind(this));
        });

        // Tech category hover effects
        document.querySelectorAll('.tech-category').forEach(category => {
            category.addEventListener('mouseenter', this.techCategoryHover.bind(this));
            category.addEventListener('mouseleave', this.techCategoryLeave.bind(this));
        });

        // Social link hover effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', this.socialLinkHover.bind(this));
            link.addEventListener('mouseleave', this.socialLinkLeave.bind(this));
        });
    }

    buttonHoverEnter(e) {
        const btn = e.currentTarget;
        const ripple = document.createElement('div');
        ripple.className = 'btn-ripple';
        btn.appendChild(ripple);

        if (btn.classList.contains('btn-primary')) {
            btn.style.transform = 'perspective(1000px) rotateX(-10deg) scale(1.05)';
            btn.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.4)';
        }
    }

    buttonHoverLeave(e) {
        const btn = e.currentTarget;
        const ripple = btn.querySelector('.btn-ripple');
        if (ripple) ripple.remove();

        btn.style.transform = '';
        btn.style.boxShadow = '';
    }

    buttonMouseMove(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        btn.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, 
            rgba(255,255,255,0.1) 0%, transparent 70%), var(--gradient)`;
    }

    techCategoryHover(e) {
        const category = e.currentTarget;
        const shimmer = category.querySelector('::before');

        category.style.transform = 'translateY(-10px) scale(1.02)';
        category.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';

        // Animate shimmer effect
        category.style.setProperty('--shimmer-active', '1');
    }

    techCategoryLeave(e) {
        const category = e.currentTarget;
        category.style.transform = '';
        category.style.boxShadow = '';
        category.style.setProperty('--shimmer-active', '0');
    }

    socialLinkHover(e) {
        const link = e.currentTarget;
        link.style.transform = 'scale(1.2) rotateY(180deg)';
        link.style.background = 'var(--gradient)';

        // Add particle effect
        this.createParticleEffect(link);
    }

    socialLinkLeave(e) {
        const link = e.currentTarget;
        link.style.transform = '';
        link.style.background = '';
    }

    setupParallaxEffects() {
        // Parallax for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        }

        // Parallax for project images
        document.querySelectorAll('.project-image').forEach(img => {
            img.addEventListener('mousemove', (e) => {
                const rect = img.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = '';
            });
        });
    }

    setupDynamicBackgrounds() {
        // Animated gradient background
        const bgAnimation = document.querySelector('.bg-animation');
        if (bgAnimation) {
            let angle = 0;
            const animateBackground = () => {
                angle += 0.5;
                const gradient = `linear-gradient(${angle}deg, 
                    var(--primary), 
                    var(--secondary), 
                    var(--accent))`;
                bgAnimation.style.background = gradient;
                requestAnimationFrame(animateBackground);
            };
            animateBackground();
        }
    }

    setupTypingAnimations() {
        const typeWriter = (element, text, speed = 100, delay = 0) => {
            setTimeout(() => {
                element.textContent = '';
                let i = 0;
                const type = () => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    }
                };
                type();
            }, delay);
        };

        // Animate hero subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            typeWriter(subtitle, text, 100, 1500);
        }

        // Animate section titles on scroll
        document.querySelectorAll('.section-title').forEach(title => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                        entry.target.setAttribute('data-animated', 'true');
                        const text = entry.target.textContent;
                        typeWriter(entry.target, text, 50);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(title);
        });
    }

    setupProjectCard3D() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(10px)
                `;

                // Update light reflection
                const lightX = (x / rect.width) * 100;
                const lightY = (y / rect.height) * 100;
                card.style.background = `
                    radial-gradient(circle at ${lightX}% ${lightY}%, 
                        rgba(255,255,255,0.1) 0%, 
                        var(--glass) 70%),
                    var(--glass)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                card.style.background = '';
            });
        });
    }

    setupTechTagAnimations() {
        document.querySelectorAll('.tech-tag').forEach(tag => {
            // Random animation delay for wave effect
            const delay = Math.random() * 2000;

            tag.addEventListener('mouseenter', () => {
                const rotation = (Math.random() - 0.5) * 10;
                tag.style.transform = `scale(1.1) rotate(${rotation}deg)`;
                tag.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.3)';

                // Ripple effect
                this.createRippleEffect(tag);
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.boxShadow = '';
            });

            // Breathing animation
            setTimeout(() => {
                tag.style.animation = 'breathe 3s ease-in-out infinite';
            }, delay);
        });
    }

    setupFloatingElements() {
        // Create additional floating particles
        const container = document.querySelector('.floating-elements');
        if (container) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 6 + 2}px;
                    height: ${Math.random() * 6 + 2}px;
                    background: var(--accent);
                    border-radius: 50%;
                    opacity: ${Math.random() * 0.5 + 0.1};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatRandom ${Math.random() * 10 + 10}s infinite ease-in-out;
                    animation-delay: ${Math.random() * 5}s;
                `;
                container.appendChild(particle);
            }
        }
    }

    triggerAnimationSequence(element) {
        // Staggered animation for child elements
        const children = element.querySelectorAll('.tech-category, .project-card, .tech-tag');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.animation = `fadeInUp 0.6s ease forwards`;
                child.style.animationDelay = `${index * 0.1}s`;
            }, index * 100);
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
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

    createParticleEffect(element) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent);
                border-radius: 50%;
                pointer-events: none;
                left: 50%;
                top: 50%;
                animation: particle-burst 1s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;

            element.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Form animations
    setupFormAnimations() {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.animateFormSubmission(form);
            });
        }

        // Input focus animations
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.style.transform = 'scale(1.02)';
                e.target.style.borderColor = 'var(--primary)';
            });

            input.addEventListener('blur', (e) => {
                e.target.parentElement.style.transform = '';
                if (!e.target.value) {
                    e.target.style.borderColor = '';
                }
            });
        });
    }

    animateFormSubmission(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        // Loading animation
        button.innerHTML = `
            <div class="loading-spinner"></div>
            Sending...
        `;
        button.disabled = true;
        button.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';

        // Simulate form submission
        setTimeout(() => {
            button.innerHTML = 'Message Sent! ✅';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            // Confetti effect
            this.createConfettiEffect();

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    createConfettiEffect() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: hsl(${Math.random() * 360}, 70%, 60%);
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: confetti-fall 3s ease-out forwards;
                animation-delay: ${Math.random() * 2}s;
            `;

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Utility method to add CSS animations
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes particle-burst {
                0% {
                    transform: scale(0) translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
            
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes floatRandom {
                0%, 100% { 
                    transform: translateY(0px) scale(1) rotate(0deg); 
                }
                25% { 
                    transform: translateY(-20px) scale(1.2) rotate(90deg); 
                }
                50% { 
                    transform: translateY(10px) scale(0.8) rotate(180deg); 
                }
                75% { 
                    transform: translateY(-15px) scale(1.1) rotate(270deg); 
                }
            }
            
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animations = new PortfolioAnimations();
    animations.addDynamicStyles();
    animations.setupFormAnimations();

    // Performance optimization: pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const elements = document.querySelectorAll('[style*="animation"]');
        elements.forEach(el => {
            if (document.hidden) {
                el.style.animationPlayState = 'paused';
            } else {
                el.style.animationPlayState = 'running';
            }
        });
    });
});

// Export for use in other modules
export default PortfolioAnimations;