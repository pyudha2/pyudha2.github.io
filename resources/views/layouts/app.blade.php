<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Pranata Yudha Pratama') }} - @yield('title', 'Full Stack Developer')</title>

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="@yield('description', 'Full Stack Developer specializing in web applications, mobile development, and scalable solutions. Crafting digital experiences with cutting-edge technologies.')">
    <meta name="keywords"
        content="@yield('keywords', 'full stack developer, web development, mobile development, Laravel, React, Vue.js, Node.js')">
    <meta name="author" content="{{ config('app.name', 'Pranata Yudha Pratama') }}">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title"
        content="{{ config('app.name', 'Pranata Yudha Pratama') }} - @yield('title', 'Full Stack Developer')">
    <meta property="og:description"
        content="@yield('description', 'Full Stack Developer specializing in web applications, mobile development, and scalable solutions.')">
    <meta property="og:image" content="@yield('og_image', asset('images/og-image.jpg'))">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title"
        content="{{ config('app.name', 'Pranata Yudha Pratama') }} - @yield('title', 'Full Stack Developer')">
    <meta name="twitter:description"
        content="@yield('description', 'Full Stack Developer specializing in web applications, mobile development, and scalable solutions.')">
    <meta name="twitter:image" content="@yield('twitter_image', asset('images/twitter-card.jpg'))">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/favicon-16x16.png') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <!-- CSS Files -->
    <link href="{{ asset('css/portfolio.css') }}" rel="stylesheet">
    <link href="{{ asset('css/hero.css') }}" rel="stylesheet">

    <!-- Additional Head Content -->
    @stack('head')

    <!-- Page Specific Styles -->
    @stack('styles')
</head>

<body class="@yield('body_class', '')">
    <!-- Animated Background -->
    <div class="bg-animation"></div>

    <!-- Floating Elements -->
    <div class="floating-elements">
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
    </div>

    <!-- Navigation -->
    @include('components.navigation')

    <!-- Main Content -->
    <main id="main-content" role="main">
        @yield('content')
    </main>

    <!-- Footer (if needed) -->
    @hasSection('footer')
    <footer>
        @yield('footer')
    </footer>
    @endif

    <!-- Loading Spinner -->
    <div id="loading-spinner" class="loading-spinner" style="display: none;">
        <div class="spinner"></div>
    </div>

    <!-- Toast Notifications Container -->
    <div id="toast-container" class="toast-container"></div>

    <!-- Cookie Consent (if needed) -->
    @if(!session('cookie_consent_accepted'))
    <div id="cookie-consent" class="cookie-consent">
        <div class="cookie-content">
            <p>This website uses cookies to enhance your experience and analyze site usage.</p>
            <div class="cookie-actions">
                <button id="accept-cookies" class="btn btn-primary btn-sm">Accept</button>
                <button id="decline-cookies" class="btn btn-secondary btn-sm">Decline</button>
            </div>
        </div>
    </div>
    @endif

    <!-- Scripts -->
    <script>
        // Global Laravel variables
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            locale: '{{ app()->getLocale() }}',
            user: @auth {{ auth()->user()->toJson() }} @else null @endauth,
            routes: {
                contact: '{{ route('contact.store') }}',
                @stack('route_variables')
            }
        };
        
        // Flash messages
        @if(session('success'))
            window.flashMessage = {
                type: 'success',
                message: '{{ session('success') }}'
            };
        @endif
        
        @if(session('error'))
            window.flashMessage = {
                type: 'error',
                message: '{{ session('error') }}'
            };
        @endif
        
        @if(session('warning'))
            window.flashMessage = {
                type: 'warning',
                message: '{{ session('warning') }}'
            };
        @endif
        
        @if(session('info'))
            window.flashMessage = {
                type: 'info',
                message: '{{ session('info') }}'
            };
        @endif

        // Portfolio data from controller (if available)
        @if(isset($portfolioData))
            window.portfolioData = {!! json_encode($portfolioData) !!};
        @endif
    </script>

    <!-- Core JavaScript Files -->
    <script src="{{ asset('js/hero.js') }}"></script>
    <script src="{{ asset('js/portfolio.js') }}"></script>
    <script src="{{ asset('js/interactions.js') }}"></script>

    <!-- Page Specific Scripts -->
    @stack('scripts')

    <!-- Initialize Flash Messages -->
    <script>
        // Show flash messages if they exist
        document.addEventListener('DOMContentLoaded', function() {
            if (window.flashMessage) {
                showNotification(window.flashMessage.message, window.flashMessage.type);
            }
        });

        // Utility function for showing notifications
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
            `;
            
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type] || colors.info};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 400px;
            `;

            const closeButton = notification.querySelector('.notification-close');
            closeButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            `;

            document.body.appendChild(notification);

            // Animate in
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });

            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

        // Cookie consent handling
        document.addEventListener('DOMContentLoaded', function() {
            const acceptBtn = document.getElementById('accept-cookies');
            const declineBtn = document.getElementById('decline-cookies');
            const cookieConsent = document.getElementById('cookie-consent');

            if (acceptBtn) {
                acceptBtn.addEventListener('click', function() {
                    // Send request to accept cookies
                    fetch('{{ route("cookie.accept") }}', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': window.Laravel.csrfToken,
                            'Content-Type': 'application/json'
                        }
                    }).then(() => {
                        cookieConsent.style.display = 'none';
                    });
                });
            }

            if (declineBtn) {
                declineBtn.addEventListener('click', function() {
                    cookieConsent.style.display = 'none';
                });
            }
        });
    </script>

    <!-- Analytics (if configured) -->
    @if(config('services.google_analytics.tracking_id'))
    <!-- Google Analytics -->
    <script async
        src="https://www.googletagmanager.com/gtag/js?id={{ config('services.google_analytics.tracking_id') }}">
    </script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '{{ config('services.google_analytics.tracking_id') }}');
    </script>
    @endif

    <!-- Structured Data -->
    @hasSection('structured_data')
    <script type="application/ld+json">
        @yield('structured_data')
    </script>
    @endif

    <!-- Service Worker Registration (if PWA) -->
    @if(config('app.pwa_enabled', false))
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
    </script>
    @endif

    <!-- Error Handling -->
    <script>
        // Global error handler
        window.addEventListener('error', function(e) {
            console.error('Global error:', e.error);
            // You can send errors to a logging service here
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            // You can send errors to a logging service here
        });

        // CSRF token setup for fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            if (!options.headers) {
                options.headers = {};
            }
            if (!options.headers['X-CSRF-TOKEN']) {
                options.headers['X-CSRF-TOKEN'] = window.Laravel.csrfToken;
            }
            if (!options.headers['Accept']) {
                options.headers['Accept'] = 'application/json';
            }
            
            return originalFetch(url, options);
        };
    </script>

    <!-- Notification Styles -->
    <style>
        .notification-message {
            flex: 1;
        }

        .notification-close:hover {
            opacity: 0.7;
        }

        .cookie-consent {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            z-index: 9999;
            color: #f8fafc;
            max-width: 500px;
        }

        .cookie-content p {
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .cookie-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .btn-sm {
            padding: 8px 16px;
            font-size: 0.875rem;
        }

        .loading-spinner {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(99, 102, 241, 0.3);
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    </style>
</body>

</html>