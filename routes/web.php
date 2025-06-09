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

    Route::resources([
        'payments' => PaymentController::class,
        'payment-methods' => PaymentMethodController::class,
        'consultations' => ConsultationController::class,
        'patients' => PatientController::class,
        'users' => RegisteredUserController::class,
        'services' => ServiceController::class,
    ]);

    // Route::get('services', [ServiceController::class, 'index'])->name('services.index');
    // Route::get('services/create', [ServiceController::class, 'create'])->name('services.create');
    // Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    // Route::get('services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    // Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    // Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
