<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProjectController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Portfolio Data
    Route::get('/portfolio', [PortfolioController::class, 'apiData']);

    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project:slug}', [PortfolioController::class, 'apiProject']);

    // Search
    Route::get('/search', [PortfolioController::class, 'search']);

    // Tech Stack
    Route::get('/tech-stack', [PortfolioController::class, 'techStack']);

    // Social Links
    Route::get('/social-links', [PortfolioController::class, 'socialLinks']);

    // Contact (with rate limiting)
    Route::post('/contact', [ContactController::class, 'store'])
        ->middleware('throttle:3,5'); // 3 requests per 5 minutes
});
