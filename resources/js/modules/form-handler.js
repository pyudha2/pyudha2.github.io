/**
 * Form Handler Module
 * Handles contact form submission with animations and validation
 */

class FormHandler {
    constructor(formSelector = '.contact-form') {
        this.form = document.querySelector(formSelector);
        this.submitButton = null;
        this.originalButtonText = '';
        this.isSubmitting = false;

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton?.textContent || 'Send Message';

        this.bindEvents();
        this.setupValidation();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input focus animations
        this.form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });
    }

    setupValidation() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });
    }

    handleInputFocus(e) {
        const input = e.target;
        const formGroup = input.closest('.form-group');

        // Add focus glow effect
        input.style.borderColor = 'var(--primary)';
        input.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        input.style.transform = 'scale(1.02)';

        // Add floating label effect if needed
        if (formGroup) {
            formGroup.classList.add('focused');
        }
    }

    handleInputBlur(e) {
        const input = e.target;
        const formGroup = input.closest('.form-group');

        // Remove focus effects
        if (!input.value) {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            input.style.boxShadow = 'none';
            input.style.transform = 'scale(1)';
        }

        if (formGroup) {
            formGroup.classList.remove('focused');
            if (input.value) {
                formGroup.classList.add('has-value');
            } else {
                formGroup.classList.remove('has-value');
            }
        }
    }

    handleInputChange(e) {
        const input = e.target;

        // Clear previous validation states
        this.clearValidationState(input);

        // Auto-resize textarea
        if (input.tagName === 'TEXTAREA') {
            this.autoResizeTextarea(input);
        }
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Remove previous validation
        this.clearValidationState(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Name validation (no numbers)
        if (field.placeholder.toLowerCase().includes('name') && value) {
            const nameRegex = /^[a-zA-Z\s'-]+$/;
            if (!nameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Name should only contain letters';
            }
        }

        // Apply validation state
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';

        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 5px;
                display: block;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            `;
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);
    }

    showFieldSuccess(field) {
        field.style.borderColor = '#10b981';
        field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';

        // Add success icon
        let successIcon = field.parentNode.querySelector('.success-icon');
        if (!successIcon) {
            successIcon = document.createElement('span');
            successIcon.className = 'success-icon';
            successIcon.innerHTML = '✓';
            successIcon.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%) scale(0);
                color: #10b981;
                font-weight: bold;
                transition: transform 0.3s ease;
            `;
            field.parentNode.style.position = 'relative';
            field.parentNode.appendChild(successIcon);
        }

        setTimeout(() => {
            successIcon.style.transform = 'translateY(-50%) scale(1)';
        }, 10);
    }

    clearValidationState(field) {
        // Reset border and shadow
        field.style.borderColor = '';
        field.style.boxShadow = '';

        // Remove error message
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            setTimeout(() => errorElement.remove(), 300);
        }

        // Remove success icon
        const successIcon = field.parentNode.querySelector('.success-icon');
        if (successIcon) {
            successIcon.style.transform = 'translateY(-50%) scale(0)';
            setTimeout(() => successIcon.remove(), 300);
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('.form-input[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            this.shakeForm();
            return;
        }

        this.isSubmitting = true;

        try {
            // Start submission animation
            this.startSubmissionAnimation();

            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call (replace with actual endpoint)
            await this.submitFormData(data);

            // Success animation
            this.showSuccessAnimation();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorAnimation();
        } finally {
            this.isSubmitting = false;
        }
    }

    startSubmissionAnimation() {
        if (!this.submitButton) return;

        // Button loading state
        this.submitButton.textContent = 'Sending...';
        this.submitButton.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        this.submitButton.style.transform = 'scale(0.98)';
        this.submitButton.disabled = true;

        // Add loading spinner
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '⟳';
        spinner.style.cssText = `
            display: inline-block;
            margin-left: 10px;
            animation: spin 1s linear infinite;
        `;
        this.submitButton.appendChild(spinner);

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    async submitFormData(data) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate for demo
                    resolve({ success: true, message: 'Message sent successfully!' });
                } else {
                    reject(new Error('Failed to send message'));
                }
            }, 2000);
        });
    }

    showSuccessAnimation() {
        if (!this.submitButton) return;

        // Remove spinner
        const spinner = this.submitButton.querySelector('.loading-spinner');
        if (spinner) spinner.remove();

        // Success state
        this.submitButton.textContent = 'Message Sent! ✅';
        this.submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        this.submitButton.style.transform = 'scale(1.05)';

        // Form success animation
        this.form.style.transform = 'scale(1.02)';
        this.form.style.filter = 'drop-shadow(0 20px 40px rgba(16, 185, 129, 0.3))';

        // Reset after delay
        setTimeout(() => {
            this.resetForm();
        }, 3000);
    }

    showErrorAnimation() {
        if (!this.submitButton) return;

        // Remove spinner
        const spinner = this.submitButton.querySelector('.loading-spinner');
        if (spinner) spinner.remove();

        // Error state
        this.submitButton.textContent = 'Failed to Send ❌';
        this.submitButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        this.submitButton.disabled = false;

        // Shake animation
        this.shakeForm();

        // Reset after delay
        setTimeout(() => {
            this.resetButton();
        }, 3000);
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';

        // Add shake keyframes if not exists
        if (!document.querySelector('#shake-styles')) {
            const style = document.createElement('style');
            style.id = 'shake-styles';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }

    resetForm() {
        // Reset form fields
        this.form.reset();

        // Clear validation states
        this.form.querySelectorAll('.form-input').forEach(input => {
            this.clearValidationState(input);
            input.style.borderColor = '';
            input.style.boxShadow = '';
            input.style.transform = '';

            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('has-value', 'focused');
            }
        });

        // Reset form animation
        this.form.style.transform = '';
        this.form.style.filter = '';

        // Reset button
        this.resetButton();
    }

    resetButton() {
        if (!this.submitButton) return;

        this.submitButton.textContent = this.originalButtonText;
        this.submitButton.style.background = 'var(--gradient)';
        this.submitButton.style.transform = '';
        this.submitButton.disabled = false;
    }

    // Public methods for external use
    reset() {
        this.resetForm();
    }

    setSubmitCallback(callback) {
        this.submitCallback = callback;
    }

    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData.entries());
    }
}

// Export for module use
export default FormHandler;

// Auto-initialize if not using modules
if (typeof window !== 'undefined' && !window.FormHandler) {
    window.FormHandler = FormHandler;

    // Auto-initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        new FormHandler();
    });
}