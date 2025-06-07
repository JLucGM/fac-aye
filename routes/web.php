<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('payments', PaymentController::class);
    Route::resource('payment-methods', PaymentMethodController::class);
    Route::resource('consultations', ConsultationController::class);
    Route::resource('patients', PatientController::class);
    Route::resource('users', RegisteredUserController::class);
    Route::resource('services', ServiceController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
