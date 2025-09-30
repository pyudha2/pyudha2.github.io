{{-- resources/views/components/hero.blade.php --}}
<section class="hero" id="home">
    <div class="hero-content">
        <h1 class="hero-title" id="heroTitle">
            {{ $name ?? 'Pranata Yudha Pratama' }}
        </h1>
        <p class="hero-subtitle" id="heroSubtitle">
            {{ $title ?? 'Full Stack Developer & Mobile Expert' }}
        </p>
        <p class="hero-description">
            {{ $description ?? 'Crafting digital experiences with cutting-edge technologies. Specializing in web
            applications, mobile development, and scalable solutions.' }}
        </p>
        <div class="cta-buttons">
            <a href="#projects" class="btn btn-primary">
                {{ $primaryButtonText ?? 'View My Work' }}
            </a>
            <a href="#contact" class="btn btn-secondary">
                {{ $secondaryButtonText ?? 'Let\'s Connect' }}
            </a>
        </div>
    </div>
</section>

{{-- Background Elements --}}
<div class="bg-animation"></div>
<div class="floating-elements">
    <div class="floating-element"></div>
    <div class="floating-element"></div>
    <div class="floating-element"></div>
    <div class="floating-element"></div>
</div>