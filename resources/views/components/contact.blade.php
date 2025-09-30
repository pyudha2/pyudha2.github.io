{{-- resources/views/components/contact.blade.php --}}
<section class="contact fade-in" id="contact">
    <div class="contact-content">
        <h2 class="section-title">Let's Build Something Amazing</h2>
        <p class="hero-description">
            Have a project in mind? I'd love to hear about it.
            Let's discuss how we can bring your ideas to life.
        </p>

        {{-- Success Message --}}
        <div id="success-message" class="alert alert-success" style="display: none;">
            <div class="alert-content">
                <span class="alert-icon">✅</span>
                <span class="alert-text">Thank you for your message! I'll get back to you soon.</span>
            </div>
        </div>

        {{-- Error Message --}}
        <div id="error-message" class="alert alert-error" style="display: none;">
            <div class="alert-content">
                <span class="alert-icon">❌</span>
                <span class="alert-text">Sorry, there was an error sending your message. Please try again.</span>
            </div>
        </div>

        {{-- Rate Limit Message --}}
        <div id="rate-limit-message" class="alert alert-warning" style="display: none;">
            <div class="alert-content">
                <span class="alert-icon">⏰</span>
                <span class="alert-text">Too many attempts. Please try again later.</span>
            </div>
        </div>

        <form id="contact-form" class="contact-form" action="{{ route('contact.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <input type="text" name="name" class="form-input @error('name') error @enderror" placeholder="Your Name"
                    value="{{ old('name') }}" required maxlength="100">
                @error('name')
                <span class="form-error">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <input type="email" name="email" class="form-input @error('email') error @enderror"
                    placeholder="Your Email" value="{{ old('email') }}" required maxlength="100">
                @error('email')
                <span class="form-error">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <select name="project_type" class="form-input form-select @error('project_type') error @enderror">
                    <option value="">Select Project Type</option>
                    <option value="web-development" {{ old('project_type')==='web-development' ? 'selected' : '' }}>
                        Web Development
                    </option>
                    <option value="mobile-app" {{ old('project_type')==='mobile-app' ? 'selected' : '' }}>
                        Mobile App
                    </option>
                    <option value="e-commerce" {{ old('project_type')==='e-commerce' ? 'selected' : '' }}>
                        E-Commerce Platform
                    </option>
                    <option value="saas" {{ old('project_type')==='saas' ? 'selected' : '' }}>
                        SaaS Solution
                    </option>
                    <option value="api-development" {{ old('project_type')==='api-development' ? 'selected' : '' }}>
                        API Development
                    </option>
                    <option value="consultation" {{ old('project_type')==='consultation' ? 'selected' : '' }}>
                        Technical Consultation
                    </option>
                    <option value="other" {{ old('project_type')==='other' ? 'selected' : '' }}>
                        Other
                    </option>
                </select>
                @error('project_type')
                <span class="form-error">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-group">
                <textarea name="message" class="form-input @error('message') error @enderror"
                    placeholder="Tell me about your project - what are your goals, timeline, and any specific requirements?"
                    required maxlength="1000" rows="6">{{ old('message') }}</textarea>
                <div class="character-count">
                    <span id="char-count">0</span>/1000 characters
                </div>
                @error('message')
                <span class="form-error">{{ $message }}</span>
                @enderror
            </div>

            <button type="submit" class="btn btn-primary" id="submit-btn">
                <span class="btn-text">Send Message</span>
                <span class="btn-loader" style="display: none;">
                    <svg class="spinner" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"
                            stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416"
                                repeatCount="indefinite" />
                            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416"
                                repeatCount="indefinite" />
                        </circle>
                    </svg>
                    Sending...
                </span>
            </button>
        </form>

        {{-- Social Links --}}
        <div class="social-links">
            <a href="https://github.com/alexchen" class="social-link" title="GitHub" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
            </a>
            <a href="https://linkedin.com/in/alexchen" class="social-link" title="LinkedIn" target="_blank"
                rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            </a>
            <a href="https://twitter.com/alexchen" class="social-link" title="Twitter" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            </a>
            <a href="mailto:hello@alexchen.dev" class="social-link" title="Email">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.727l9.637 7.227 9.637-7.227h.727c.904 0 1.636.732 1.636 1.636z" />
                </svg>
            </a>
        </div>
    </div>
</section>