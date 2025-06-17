<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\ModuleoperationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\RoleController;
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
        'roles' => RoleController::class,
    ]);

    Route::get('module-operation', [ModuleOperationController::class, 'index'])->name('module-operation.index');
    Route::get('first-visit', [ModuleOperationController::class, 'first_visit_index'])->name('module-operation.first_visit_index');
    Route::post('first-visit-store', [ModuleOperationController::class, 'first_visit_store'])->name('module-operation.first_visit_store');
    Route::get('profile-patient-index', [ModuleOperationController::class, 'profile_patient_index'])->name('module-operation.profile_patient_index');
    // Route::get('services', [ServiceController::class, 'index'])->name('services.index');
    // Route::get('services/create', [ServiceController::class, 'create'])->name('services.create');
    // Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    // Route::get('services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    // Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    // Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
