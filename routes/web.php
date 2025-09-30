<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProjectController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Main Portfolio Page
Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');

// Project Routes
Route::get('/projects/{project:slug}', [PortfolioController::class, 'project'])->name('projects.show');

// Contact Form
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/cookie/accept', function () {
    session(['cookie_consent_accepted' => true]);
    return response()->json(['success' => true]);
})->name('cookie.accept');

// Search
Route::get('/search', [PortfolioController::class, 'search'])->name('portfolio.search');
