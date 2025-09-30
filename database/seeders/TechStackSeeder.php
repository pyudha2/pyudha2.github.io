<?php

namespace Database\Seeders;

use App\Models\TechStack;
use Illuminate\Database\Seeder;

class TechStackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techStacks = [
            // Backend Development
            [
                'name' => 'Laravel 12',
                'category' => 'Backend Development',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Node.js',
                'category' => 'Backend Development',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Python',
                'category' => 'Backend Development',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Django',
                'category' => 'Backend Development',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'PostgreSQL',
                'category' => 'Backend Development',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'MongoDB',
                'category' => 'Backend Development',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Redis',
                'category' => 'Backend Development',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Docker',
                'category' => 'Backend Development',
                'order' => 8,
                'is_active' => true,
            ],

            // Frontend Development
            [
                'name' => 'React 18',
                'category' => 'Frontend Development',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Next.js',
                'category' => 'Frontend Development',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Vue.js',
                'category' => 'Frontend Development',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'TypeScript',
                'category' => 'Frontend Development',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Tailwind CSS',
                'category' => 'Frontend Development',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Framer Motion',
                'category' => 'Frontend Development',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Three.js',
                'category' => 'Frontend Development',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'GSAP',
                'category' => 'Frontend Development',
                'order' => 8,
                'is_active' => true,
            ],

            // Mobile Development
            [
                'name' => 'React Native',
                'category' => 'Mobile Development',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Flutter',
                'category' => 'Mobile Development',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Swift',
                'category' => 'Mobile Development',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Kotlin',
                'category' => 'Mobile Development',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Expo',
                'category' => 'Mobile Development',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Firebase',
                'category' => 'Mobile Development',
                'order' => 6,
                'is_active' => true,
            ],

            // DevOps & Cloud
            [
                'name' => 'AWS',
                'category' => 'DevOps & Cloud',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Google Cloud',
                'category' => 'DevOps & Cloud',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Vercel',
                'category' => 'DevOps & Cloud',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'GitHub Actions',
                'category' => 'DevOps & Cloud',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Kubernetes',
                'category' => 'DevOps & Cloud',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Nginx',
                'category' => 'DevOps & Cloud',
                'order' => 6,
                'is_active' => true,
            ],

            // Additional technologies not in the main design
            [
                'name' => 'MySQL',
                'category' => 'Backend Development',
                'order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Express.js',
                'category' => 'Backend Development',
                'order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Symfony',
                'category' => 'Backend Development',
                'order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'FastAPI',
                'category' => 'Backend Development',
                'order' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Angular',
                'category' => 'Frontend Development',
                'order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Svelte',
                'category' => 'Frontend Development',
                'order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Sass/SCSS',
                'category' => 'Frontend Development',
                'order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'Webpack',
                'category' => 'Frontend Development',
                'order' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Ionic',
                'category' => 'Mobile Development',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Xamarin',
                'category' => 'Mobile Development',
                'order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Digital Ocean',
                'category' => 'DevOps & Cloud',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Terraform',
                'category' => 'DevOps & Cloud',
                'order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Jenkins',
                'category' => 'DevOps & Cloud',
                'order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Ansible',
                'category' => 'DevOps & Cloud',
                'order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($techStacks as $tech) {
            TechStack::create($tech);
        }
    }
}
