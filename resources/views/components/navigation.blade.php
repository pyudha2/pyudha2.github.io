{{-- Navigation Component --}}
<nav class="main-nav nav-fade-in" id="main-navigation" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
        {{-- Navigation Menu --}}
        <div class="nav-menu" id="nav-menu">
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="#home" class="nav-link active" data-section="home">
                        <span class="nav-text">Home</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#about" class="nav-link" data-section="about">
                        <span class="nav-text">About</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#projects" class="nav-link" data-section="projects">
                        <span class="nav-text">Projects</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#contact" class="nav-link" data-section="contact">
                        <span class="nav-text">Contact</span>
                    </a>
                </li>
            </ul>
            {{-- Progress indicator for active section --}}
            <div class="nav-progress" id="nav-progress"></div>
        </div>
    </div>
</nav>