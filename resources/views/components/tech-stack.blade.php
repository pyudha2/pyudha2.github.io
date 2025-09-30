<section class="tech-stack fade-in" id="about">
    <h2 class="section-title">{{ $sectionTitle ?? 'Technology Stack' }}</h2>
    <div class="tech-grid">
        @foreach($techStacks as $category)
        <div class="tech-category fade-in">
            <h3>{{ $category['title'] ?? 'Untitled Category' }}</h3>
            <div class="tech-tags">
                @foreach($category['technologies'] as $tech)
                <span class="tech-tag" title="{{ $tech['name'] }}">
                    {{ $tech['name'] }}
                </span>
                @endforeach
            </div>
        </div>
        @endforeach
    </div>
</section>