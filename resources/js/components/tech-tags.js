/**
 * Tech Tags Component
 * Handles interactive effects for technology tags in the portfolio
 */

class TechTags {
    constructor() {
        this.tags = document.querySelectorAll('.tech-tag');
        this.animationQueue = [];
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
    }

    bindEvents() {
        this.tags.forEach((tag, index) => {
            // Mouse enter effect
            tag.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, index));

            // Mouse leave effect
            tag.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

            // Click effect
            tag.addEventListener('click', (e) => this.handleClick(e));

            // Touch support for mobile
            tag.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            tag.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        });
    }

    handleMouseEnter(event, index) {
        const tag = event.currentTarget;
        const delay = index * 50; // Staggered animation

        // Clear any existing animations
        tag.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(() => {
            tag.style.transform = 'scale(1.1) rotate(2deg)';
            tag.style.background = 'rgba(99, 102, 241, 0.4)';
            tag.style.borderColor = 'rgba(99, 102, 241, 0.6)';
            tag.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
            tag.style.zIndex = '10';

            // Add glow effect
            tag.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))';

            // Animate text color
            tag.style.color = '#ffffff';
        }, delay);

        // Add subtle bounce animation
        this.addBounceAnimation(tag);

        // Create particle effect around the tag
        this.createParticleEffect(tag);
    }

    handleMouseLeave(event) {
        const tag = event.currentTarget;

        tag.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        tag.style.transform = 'scale(1) rotate(0deg)';
        tag.style.background = 'rgba(99, 102, 241, 0.2)';
        tag.style.borderColor = 'rgba(99, 102, 241, 0.3)';
        tag.style.boxShadow = 'none';
        tag.style.zIndex = 'auto';
        tag.style.filter = 'none';
        tag.style.color = 'var(--text-primary)';

        // Remove any particle effects
        this.removeParticleEffect(tag);
    }

    handleClick(event) {
        const tag = event.currentTarget;
        const tagText = tag.textContent.trim();

        // Pulse animation on click
        tag.style.animation = 'pulse-click 0.6s ease-out';

        // Log for analytics (if needed)
        console.log(`Tech tag clicked: ${tagText}`);

        // Remove animation class after completion
        setTimeout(() => {
            tag.style.animation = '';
        }, 600);
    }

    handleTouchStart(event) {
        const tag = event.currentTarget;
        tag.classList.add('touch-active');
        tag.style.transform = 'scale(0.95)';
    }

    handleTouchEnd(event) {
        const tag = event.currentTarget;
        tag.classList.remove('touch-active');
        tag.style.transform = 'scale(1)';
    }

    addBounceAnimation(tag) {
        let bounceCount = 0;
        const maxBounces = 3;

        const bounce = () => {
            if (bounceCount < maxBounces) {
                const scale = 1.1 + (Math.sin(bounceCount * Math.PI) * 0.05);
                tag.style.transform = `scale(${scale}) rotate(2deg)`;
                bounceCount++;
                setTimeout(bounce, 100);
            }
        };

        setTimeout(bounce, 200);
    }

    createParticleEffect(tag) {
        const rect = tag.getBoundingClientRect();
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.position = 'fixed';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '1000';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';

        // Create multiple particles
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'rgba(99, 102, 241, 0.8)';
            particle.style.borderRadius = '50%';
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;

            const angle = (i / 6) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const duration = 800 + Math.random() * 400;

            particle.style.animation = `
                particle-float-${i} ${duration}ms ease-out forwards
            `;

            // Create unique animation for each particle
            this.createParticleAnimation(i, angle, distance, duration);

            particleContainer.appendChild(particle);
        }

        document.body.appendChild(particleContainer);
        tag.particleContainer = particleContainer;

        // Remove particles after animation
        setTimeout(() => {
            if (particleContainer.parentNode) {
                particleContainer.parentNode.removeChild(particleContainer);
            }
        }, 1200);
    }

    createParticleAnimation(index, angle, distance, duration) {
        const animationName = `particle-float-${index}`;
        const keyframes = `
            @keyframes ${animationName} {
                0% {
                    transform: translate(0, 0) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0);
                    opacity: 0;
                }
            }
        `;

        // Check if style element exists, create if not
        let styleSheet = document.getElementById('particle-animations');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'particle-animations';
            document.head.appendChild(styleSheet);
        }

        styleSheet.textContent += keyframes;
    }

    removeParticleEffect(tag) {
        if (tag.particleContainer && tag.particleContainer.parentNode) {
            tag.particleContainer.style.opacity = '0';
            setTimeout(() => {
                if (tag.particleContainer.parentNode) {
                    tag.particleContainer.parentNode.removeChild(tag.particleContainer);
                }
            }, 300);
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTagsInView(entry.target);
                }
            });
        }, options);

        // Observe tech category containers
        document.querySelectorAll('.tech-category').forEach(category => {
            observer.observe(category);
        });
    }

    animateTagsInView(category) {
        const tags = category.querySelectorAll('.tech-tag');

        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px) scale(0.8)';
            tag.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    // Method to filter tags by category
    filterTags(category) {
        this.tags.forEach(tag => {
            const tagCategory = tag.closest('.tech-category');
            const categoryTitle = tagCategory.querySelector('h3').textContent;

            if (category === 'all' || categoryTitle.toLowerCase().includes(category.toLowerCase())) {
                tag.style.display = 'inline-block';
                tag.style.animation = 'fadeInScale 0.5s ease forwards';
            } else {
                tag.style.display = 'none';
            }
        });
    }

    // Method to highlight specific technologies
    highlightTech(techNames) {
        this.tags.forEach(tag => {
            const tagText = tag.textContent.trim();
            if (techNames.includes(tagText)) {
                tag.classList.add('highlighted');
                tag.style.background = 'rgba(6, 182, 212, 0.3)';
                tag.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                tag.style.animation = 'pulse-highlight 2s infinite';
            } else {
                tag.classList.remove('highlighted');
                tag.style.animation = '';
            }
        });
    }

    // Method to get random tech suggestion
    getRandomTechSuggestion() {
        const randomTag = this.tags[Math.floor(Math.random() * this.tags.length)];
        const techName = randomTag.textContent.trim();

        // Briefly highlight the random tag
        randomTag.style.animation = 'pulse-suggestion 1s ease-out';
        setTimeout(() => {
            randomTag.style.animation = '';
        }, 1000);

        return {
            name: techName,
            element: randomTag
        };
    }

    // Cleanup method
    destroy() {
        this.tags.forEach(tag => {
            // Remove event listeners and reset styles
            tag.style = '';
            tag.className = tag.className.replace(/touch-active|highlighted/g, '').trim();
        });

        // Remove particle animation styles
        const particleStyles = document.getElementById('particle-animations');
        if (particleStyles) {
            particleStyles.remove();
        }
    }
}

// CSS animations to be injected
const techTagStyles = `
    @keyframes pulse-click {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes pulse-highlight {
        0%, 100% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.3); }
        50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.6); }
    }
    
    @keyframes pulse-suggestion {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.1) rotate(-2deg); }
        75% { transform: scale(1.1) rotate(2deg); }
    }
    
    .tech-tag.touch-active {
        transition: transform 0.1s ease !important;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = techTagStyles;
document.head.appendChild(styleSheet);

// Export for use in other modules
export default TechTags;