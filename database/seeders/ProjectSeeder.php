<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Featured projects from the design
        $featuredProjects = [
            [
                'title' => 'E-Commerce Platform',
                'slug' => 'e-commerce-platform',
                'description' => 'Full-stack e-commerce solution with real-time inventory, payment processing, and advanced analytics. Built with microservices architecture.',
                'emoji' => '🚀',
                'live_url' => 'https://demo-ecommerce.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/ecommerce-platform',
                'demo_url' => 'https://demo-ecommerce.alexchen.dev',
                'order' => 1,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Fitness Tracking App',
                'slug' => 'fitness-tracking-app',
                'description' => 'Cross-platform mobile app with workout tracking, social features, and AI-powered recommendations. 50k+ active users.',
                'emoji' => '📱',
                'app_store_url' => 'https://apps.apple.com/app/fitness-tracker',
                'case_study_url' => 'https://alexchen.dev/case-study/fitness-app',
                'order' => 2,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'SaaS Analytics Dashboard',
                'slug' => 'saas-analytics-dashboard',
                'description' => 'Real-time analytics platform with custom visualizations, automated reporting, and multi-tenant architecture. Processes 1M+ events daily.',
                'emoji' => '🌐',
                'live_url' => 'https://analytics-demo.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/saas-analytics',
                'demo_url' => 'https://analytics-demo.alexchen.dev',
                'case_study_url' => 'https://alexchen.dev/case-study/analytics-platform',
                'order' => 3,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'AI Chat Platform',
                'slug' => 'ai-chat-platform',
                'description' => 'Intelligent chatbot platform with natural language processing, multi-language support, and seamless integrations.',
                'emoji' => '🤖',
                'live_url' => 'https://ai-chat.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/ai-chat-platform',
                'demo_url' => 'https://ai-chat.alexchen.dev/demo',
                'order' => 4,
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        // Create featured projects
        foreach ($featuredProjects as $project) {
            Project::create($project);
        }

        // Additional projects to populate the portfolio
        $additionalProjects = [
            [
                'title' => 'Task Management System',
                'slug' => 'task-management-system',
                'description' => 'Collaborative task management platform with real-time updates, team collaboration features, and advanced reporting capabilities.',
                'emoji' => '📋',
                'live_url' => 'https://taskify.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/taskify',
                'order' => 5,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Weather Forecast App',
                'slug' => 'weather-forecast-app',
                'description' => 'Beautiful weather application with location-based forecasts, interactive maps, and weather alerts.',
                'emoji' => '🌤️',
                'live_url' => 'https://weather.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/weather-app',
                'app_store_url' => 'https://apps.apple.com/app/weather-pro',
                'order' => 6,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Social Media Dashboard',
                'slug' => 'social-media-dashboard',
                'description' => 'Unified social media management platform with scheduling, analytics, and multi-platform posting capabilities.',
                'emoji' => '📊',
                'live_url' => 'https://social-dash.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/social-dashboard',
                'case_study_url' => 'https://alexchen.dev/case-study/social-media',
                'order' => 7,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Learning Management System',
                'slug' => 'learning-management-system',
                'description' => 'Complete LMS solution with course creation, progress tracking, interactive quizzes, and certification system.',
                'emoji' => '🎓',
                'demo_url' => 'https://lms-demo.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/lms-platform',
                'order' => 8,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Cryptocurrency Tracker',
                'slug' => 'cryptocurrency-tracker',
                'description' => 'Real-time cryptocurrency tracking app with portfolio management, price alerts, and market analysis tools.',
                'emoji' => '₿',
                'live_url' => 'https://crypto-tracker.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/crypto-tracker',
                'order' => 9,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Recipe Sharing Platform',
                'slug' => 'recipe-sharing-platform',
                'description' => 'Community-driven recipe sharing platform with meal planning, ingredient tracking, and social features.',
                'emoji' => '👨‍🍳',
                'live_url' => 'https://recipes.alexchen.dev',
                'github_url' => 'https://github.com/alexchen/recipe-platform',
                'app_store_url' => 'https://apps.apple.com/app/recipe-share',
                'order' => 10,
                'is_featured' => false,
                'is_active' => true,
            ],
        ];

        // Create additional projects
        foreach ($additionalProjects as $project) {
            Project::create($project);
        }

        // Create some random projects using factory
        Project::factory()->count(5)->create();
    }
}
