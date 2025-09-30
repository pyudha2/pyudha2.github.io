/**
 * Project Cards Module
 * Handles 3D hover effects, animations, and interactions for project cards
 */

class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.isInitialized = false;
        this.observers = new Map();

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.setupCardEffects();
        this.setupCardAnimations();
        this.setupLinkInteractions();
        this.setupImageHovers();
        this.setupIntersectionObserver();

        this.isInitialized = true;
    }

    /**
     * Setup 3D hover effects for project cards
     */
    setupCardEffects() {
        this.cards.forEach(card => {
            // Store original transform for reset
            card.dataset.originalTransform = card.style.transform || '';

            card.addEventListener('mousemove', (e) => this.handleCardMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleCardMouseLeave(e, card));
            card.addEventListener('mouseenter', (e) => this.handleCardMouseEnter(e, card));
        });
    }

    /**
     * Handle mouse movement over cards for 3D effect
     */
    handleCardMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on mouse position
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        // Apply 3D transform
        const transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
            scale(1.02)
        `;

        card.style.transform = transform;
        card.style.transition = 'none';

        // Add subtle glow effect
        card.style.boxShadow = `
            0 30px 60px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(99, 102, 241, 0.2)
        `;
    }

    /**
     * Handle mouse enter on cards
     */
    handleCardMouseEnter(e, card) {
        card.classList.add('card-hovered');

        // Animate tech tags
        const techTags = card.querySelectorAll('.tech-tag');
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'scale(1.05) translateY(-2px)';
                tag.style.transition = 'all 0.2s ease';
            }, index * 50);
        });

        // Enhance project image
        const projectImage = card.querySelector('.project-image');
        if (projectImage) {
            projectImage.style.transform = 'scale(1.1) rotateZ(5deg)';
            projectImage.style.filter = 'brightness(1.1) saturate(1.2)';
        }
    }

    /**
     * Handle mouse leave from cards
     */
    handleCardMouseLeave(e, card) {
        card.classList.remove('card-hovered');

        // Reset transform with smooth transition
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';

        // Reset tech tags
        const techTags = card.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.style.transform = 'scale(1) translateY(0)';
            tag.style.transition = 'all 0.3s ease';
        });

        // Reset project image
        const projectImage = card.querySelector('.project-image');
        if (projectImage) {
            projectImage.style.transform = 'scale(1) rotateZ(0deg)';
            projectImage.style.filter = 'brightness(1) saturate(1)';
        }
    }

    /**
     * Setup entrance animations for cards
     */
    setupCardAnimations() {
        this.cards.forEach((card, index) => {
            // Initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.95)';

            // Store animation delay
            card.dataset.animationDelay = index * 100;
        });
    }

    /**
     * Animate card entrance
     */
    animateCardEntrance(card) {
        const delay = parseInt(card.dataset.animationDelay) || 0;

        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';

            // Animate internal elements
            this.animateCardContent(card);
        }, delay);
    }

    /**
     * Animate card content elements
     */
    animateCardContent(card) {
        const elements = [
            card.querySelector('.project-image'),
            card.querySelector('.project-title'),
            card.querySelector('.project-description'),
            card.querySelector('.project-tech'),
            card.querySelector('.project-links')
        ].filter(Boolean);

        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Setup project link interactions
     */
    setupLinkInteractions() {
        this.cards.forEach(card => {
            const links = card.querySelectorAll('.project-link');

            links.forEach(link => {
                link.addEventListener('mouseenter', this.handleLinkHover);
                link.addEventListener('mouseleave', this.handleLinkLeave);
                link.addEventListener('click', this.handleLinkClick);
            });
        });
    }

    /**
     * Handle project link hover
     */
    handleLinkHover(e) {
        const link = e.currentTarget;
        link.style.transform = 'scale(1.1) translateY(-2px)';
        link.style.boxShadow = '0 10px 20px rgba(6, 182, 212, 0.3)';

        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'link-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        link.style.position = 'relative';
        link.style.overflow = 'hidden';
        link.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Handle project link leave
     */
    handleLinkLeave(e) {
        const link = e.currentTarget;
        link.style.transform = 'scale(1) translateY(0)';
        link.style.boxShadow = 'none';
    }

    /**
     * Handle project link click
     */
    handleLinkClick(e) {
        e.preventDefault();

        const link = e.currentTarget;
        const originalText = link.textContent;

        // Animate click feedback
        link.style.transform = 'scale(0.95)';

        setTimeout(() => {
            link.style.transform = 'scale(1.05)';
            link.textContent = 'Loading...';

            setTimeout(() => {
                link.style.transform = 'scale(1)';
                link.textContent = originalText;

                // Simulate navigation (replace with actual navigation logic)
                console.log(`Navigating to: ${link.href || link.textContent}`);
            }, 1000);
        }, 100);
    }

    /**
     * Setup project image hover effects
     */
    setupImageHovers() {
        this.cards.forEach(card => {
            const image = card.querySelector('.project-image');
            if (!image) return;

            image.addEventListener('mouseenter', () => {
                image.style.transition = 'all 0.3s ease';
                image.style.transform = 'scale(1.1) rotateZ(5deg)';
                image.style.filter = 'brightness(1.2) saturate(1.3)';

                // Add floating animation
                image.style.animation = 'float-project-image 2s ease-in-out infinite';
            });

            image.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1) rotateZ(0deg)';
                image.style.filter = 'brightness(1) saturate(1)';
                image.style.animation = 'none';
            });
        });
    }

    /**
     * Setup intersection observer for scroll animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCardEntrance(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.cards.forEach(card => observer.observe(card));
        this.observers.set('entrance', observer);
    }

    /**
     * Add custom CSS animations
     */
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
            
            @keyframes float-project-image {
                0%, 100% {
                    transform: scale(1.1) rotateZ(5deg) translateY(0px);
                }
                50% {
                    transform: scale(1.1) rotateZ(5deg) translateY(-5px);
                }
            }
            
            .project-card.card-hovered .project-title {
                color: var(--accent);
                transition: color 0.3s ease;
            }
            
            .project-card.card-hovered .project-description {
                color: var(--text-primary);
                transition: color 0.3s ease;
            }
            
            .project-card .project-image,
            .project-card .project-title,
            .project-card .project-description,
            .project-card .project-tech,
            .project-card .project-links {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Filter projects by technology
     */
    filterByTech(techName) {
        this.cards.forEach(card => {
            const techTags = card.querySelectorAll('.tech-tag');
            const hasTech = Array.from(techTags).some(tag =>
                tag.textContent.toLowerCase().includes(techName.toLowerCase())
            );

            if (hasTech || techName === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Get project data
     */
    getProjectData() {
        return Array.from(this.cards).map(card => ({
            title: card.querySelector('.project-title')?.textContent,
            description: card.querySelector('.project-description')?.textContent,
            technologies: Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent),
            links: Array.from(card.querySelectorAll('.project-link')).map(link => ({
                text: link.textContent,
                href: link.href
            }))
        }));
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        // Remove event listeners
        this.cards.forEach(card => {
            card.removeEventListener('mousemove', this.handleCardMouseMove);
            card.removeEventListener('mouseleave', this.handleCardMouseLeave);
            card.removeEventListener('mouseenter', this.handleCardMouseEnter);
        });

        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        this.isInitialized = false;
    }

    /**
     * Reinitialize with new cards
     */
    refresh() {
        this.destroy();
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectCards = new ProjectCards();
    window.projectCards.addCustomStyles();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectCards;
}