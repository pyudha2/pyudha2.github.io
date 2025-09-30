<?php

namespace Database\Seeders;

use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialLinks = [
            [
                'name' => 'GitHub',
                'url' => 'https://github.com/alexchen',
                'icon' => '🐙',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'LinkedIn',
                'url' => 'https://linkedin.com/in/alexchen-dev',
                'icon' => '💼',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Twitter',
                'url' => 'https://twitter.com/alexchen_dev',
                'icon' => '🐦',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Email',
                'url' => 'mailto:alex@alexchen.dev',
                'icon' => '📧',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Instagram',
                'url' => 'https://instagram.com/alexchen.dev',
                'icon' => '📷',
                'order' => 5,
                'is_active' => false, // Not active by default, can be enabled later
            ],
            [
                'name' => 'Discord',
                'url' => 'https://discord.gg/alexchen',
                'icon' => '🎮',
                'order' => 10,
                'is_active' => false,
            ],
        ];

        foreach ($socialLinks as $link) {
            SocialLink::create($link);
        }
    }
}
