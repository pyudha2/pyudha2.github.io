// resources/js/components/contact-form.js

export default function initContactForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    // Contact form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get the submit button
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        // Add submission animation
        button.textContent = 'Sending...';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        button.disabled = true;

        // Simulate form submission with timeout
        setTimeout(() => {
            button.textContent = 'Message Sent! ✅';

            // Reset after success message
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'var(--gradient)';
                button.disabled = false;
                this.reset();
            }, 2000);
        }, 1000);
    });

    // Enhanced form input animations
    const inputs = form.querySelectorAll('.form-input');

    inputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', function () {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
        });

        // Blur effects
        input.addEventListener('blur', function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });

        // Typing effects
        input.addEventListener('input', function () {
            if (this.value.length > 0) {
                this.style.borderColor = 'var(--accent)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });

    // Form validation with visual feedback
    function validateForm() {
        const nameInput = form.querySelector('input[placeholder="Your Name"]');
        const emailInput = form.querySelector('input[placeholder="Your Email"]');
        const messageInput = form.querySelector('textarea[placeholder="Tell me about your project"]');

        let isValid = true;

        // Reset previous validation styles
        inputs.forEach(input => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });

        // Validate name
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = '#ef4444';
            nameInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
            isValid = false;
        }

        // Validate message
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            messageInput.style.borderColor = '#ef4444';
            messageInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
            isValid = false;
        }

        return isValid;
    }

    // Add validation on form submit
    form.addEventListener('submit', function (e) {
        if (!validateForm()) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // Real-time validation feedback
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateSingleField(this);
        });
    });

    function validateSingleField(field) {
        const placeholder = field.getAttribute('placeholder');

        setTimeout(() => {
            if (placeholder === 'Your Name' && !field.value.trim()) {
                field.style.borderColor = '#ef4444';
            } else if (placeholder === 'Your Email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim() || !emailRegex.test(field.value)) {
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = 'var(--accent)';
                }
            } else if (placeholder === 'Tell me about your project' && field.value.trim().length < 10) {
                field.style.borderColor = '#ef4444';
            } else if (field.value.trim()) {
                field.style.borderColor = 'var(--accent)';
            }
        }, 100);
    }

    // Add floating label effect
    inputs.forEach(input => {
        const wrapper = input.parentElement;
        const placeholder = input.getAttribute('placeholder');

        // Create floating label
        const label = document.createElement('label');
        label.textContent = placeholder;
        label.style.cssText = `
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            color: var(--text-secondary);
            font-size: 1rem;
            pointer-events: none;
            transition: all 0.3s ease;
            background: var(--bg-primary);
            padding: 0 5px;
            opacity: 0;
            z-index: 1;
        `;

        if (input.tagName === 'TEXTAREA') {
            label.style.top = '30px';
        }

        wrapper.appendChild(label);

        // Show/hide floating label
        input.addEventListener('focus', () => {
            if (!input.value) {
                input.setAttribute('placeholder', '');
                label.style.opacity = '1';
                label.style.top = input.tagName === 'TEXTAREA' ? '0' : '0';
                label.style.fontSize = '0.85rem';
                label.style.color = 'var(--accent)';
            }
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.setAttribute('placeholder', placeholder);
                label.style.opacity = '0';
                label.style.top = input.tagName === 'TEXTAREA' ? '30px' : '50%';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--text-secondary)';
            }
        });
    });

    // Add character counter for textarea
    const textarea = form.querySelector('textarea');
    if (textarea) {
        const counter = document.createElement('div');
        counter.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-size: 0.75rem;
            color: var(--text-secondary);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        textarea.parentElement.appendChild(counter);

        textarea.addEventListener('input', function () {
            const count = this.value.length;
            counter.textContent = `${count}/1000`;

            if (count > 0) {
                counter.style.opacity = '1';
            } else {
                counter.style.opacity = '0';
            }

            if (count > 900) {
                counter.style.color = '#ef4444';
            } else if (count > 800) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        });

        textarea.addEventListener('focus', () => {
            if (textarea.value.length > 0) {
                counter.style.opacity = '1';
            }
        });

        textarea.addEventListener('blur', () => {
            counter.style.opacity = '0';
        });
    }

    // Add ripple effect to submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .form-group {
            position: relative;
        }
        
        .form-input:invalid {
            border-color: rgba(239, 68, 68, 0.5);
        }
        
        .form-input:valid {
            border-color: rgba(6, 182, 212, 0.5);
        }
    `;
    document.head.appendChild(style);
}