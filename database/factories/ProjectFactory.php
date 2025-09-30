<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(3, false);
        $emojis = ['🚀', '📱', '🌐', '🤖', '💻', '⚡', '🎯', '🔥', '✨', '🛠️'];

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraph(3),
            'emoji' => $this->faker->randomElement($emojis),
            'image' => $this->faker->imageUrl(400, 200, 'technology'),
            'live_url' => $this->faker->optional(0.7)->url(),
            'demo_url' => $this->faker->optional(0.5)->url(),
            'github_url' => $this->faker->optional(0.8)->url(),
            'case_study_url' => $this->faker->optional(0.3)->url(),
            'app_store_url' => $this->faker->optional(0.2)->url(),
            'order' => $this->faker->numberBetween(1, 10),
            'is_featured' => $this->faker->boolean(60), // 60% chance of being featured
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Indicate that the project is featured.
     */
    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the project is not active.
     */
    public function inactive(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create an e-commerce project.
     */
    public function ecommerce(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => 'E-Commerce Platform',
            'slug' => 'e-commerce-platform',
            'description' => 'Full-stack e-commerce solution with real-time inventory, payment processing, and advanced analytics. Built with microservices architecture.',
            'emoji' => '🚀',
            'is_featured' => true,
        ]);
    }

    /**
     * Create a mobile app project.
     */
    public function mobileApp(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => 'Fitness Tracking App',
            'slug' => 'fitness-tracking-app',
            'description' => 'Cross-platform mobile app with workout tracking, social features, and AI-powered recommendations. 50k+ active users.',
            'emoji' => '📱',
            'app_store_url' => 'https://apps.apple.com/app/fitness-tracker',
            'is_featured' => true,
        ]);
    }

    /**
     * Create a SaaS dashboard project.
     */
    public function saas(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => 'SaaS Analytics Dashboard',
            'slug' => 'saas-analytics-dashboard',
            'description' => 'Real-time analytics platform with custom visualizations, automated reporting, and multi-tenant architecture. Processes 1M+ events daily.',
            'emoji' => '🌐',
            'is_featured' => true,
        ]);
    }

    /**
     * Create an AI chat platform project.
     */
    public function aiChat(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => 'AI Chat Platform',
            'slug' => 'ai-chat-platform',
            'description' => 'Intelligent chatbot platform with natural language processing, multi-language support, and seamless integrations.',
            'emoji' => '🤖',
            'is_featured' => true,
        ]);
    }
}
