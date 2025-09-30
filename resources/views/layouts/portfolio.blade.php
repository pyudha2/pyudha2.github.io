<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pranata Yudha Pratama - Full Stack Developer')</title>
    <meta name="description"
        content="@yield('description', 'Full Stack Developer & Mobile Expert specializing in web applications, mobile development, and scalable solutions.')">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <!-- External CSS -->
    @yield('styles')

    <!-- Custom CSS -->
    <link href="{{ asset('css/portfolio.css') }}" rel="stylesheet">

    @stack('head')
</head>

<body>
    <div class="bg-animation"></div>
    <div class="floating-elements">
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
    </div>

    @include('components.navigation')

    <main>
        @yield('content')
    </main>

    @include('components.contact')

    <!-- External Scripts -->
    @yield('scripts')

    <!-- Custom Scripts -->
    <script src="{{ asset('js/animations.js') }}"></script>
    <script src="{{ asset('js/interactions.js') }}"></script>
    <script src="{{ asset('js/portfolio.js') }}"></script>

    @stack('scripts')

    <script>
        // Set CSRF token for AJAX requests
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
            'apiUrl' => url('/api'),
        ]) !!};
        
        // Add CSRF token to all AJAX requests
        document.addEventListener('DOMContentLoaded', function() {
            // Set up CSRF token for fetch requests
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            // Configure fetch defaults
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['X-CSRF-TOKEN'] = token;
                options.headers['Accept'] = 'application/json';
                options.headers['Content-Type'] = 'application/json';
                
                return originalFetch(url, options);
            };
        });
    </script>
</body>

</html>