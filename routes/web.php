<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ClosuresController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\ModuleAdministrativeController;
use App\Http\Controllers\ModuleAssistanceController;
use App\Http\Controllers\ModuleOperationController;
use App\Http\Controllers\ModuleOperationSystemController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
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
        'user' => UserController::class,
        'doctors' => DoctorController::class,
        'subscriptions' => SubscriptionController::class,
        'medical-records' => MedicalRecordController::class,
        'invoices' => InvoiceController::class,
    ]);

    Route::get('subscription-patient', [PatientController::class, 'subscriptionpatientstore'])->name('subscriptionpatient.store');
Route::post('/patients/subscription', [PatientController::class, 'updateSubscription'])->name('patients.subscription.update');

    Route::get('module-operation', [ModuleOperationController::class, 'index'])->name('module-operation.index');
    Route::get('first-visit', [ModuleOperationController::class, 'first_visit_index'])->name('module-operation.first_visit_index');
    Route::post('first-visit-store', [ModuleOperationController::class, 'first_visit_store'])->name('module-operation.first_visit_store');
    Route::get('profile-patient-index', [ModuleOperationController::class, 'profile_patient_index'])->name('module-operation.profile_patient_index');

    Route::get('module-administrative', [ModuleAdministrativeController::class, 'index'])->name('module-administrative.index');

    Route::get('module-assistance', [ModuleAssistanceController::class, 'index'])->name('module-assistance.index');

    Route::get('module-operation-system', [ModuleOperationSystemController::class, 'index'])->name('module-operation-system.index');

    Route::get('accounts-receivable', [PaymentController::class, 'accounts_receivable_index'])->name('module-operation.accounts_receivable_index');

    Route::get('/cierre-del-dia', [ClosuresController::class, 'cierreDelDia'])->name('cierre.del.dia');
    Route::get('/pagos-del-dia', [ClosuresController::class, 'pagosDelDia'])->name('pagos.del.dia');
    Route::get('/cierre/por/rango', [ClosuresController::class, 'cierrePorRango'])->name('cierre.por.rango');
    Route::get('/pagos/por/rango', [ClosuresController::class, 'pagosPorRango'])->name('pagos.por.rango');
    
Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'invoicePdf'])->name('invoices.pdf');


    Route::get('/consultation-pdf/{consultation}', [ClosuresController::class, 'consultationpdf'])->name('consultationpdf');

    // Route::get('services', [ServiceController::class, 'index'])->name('services.index');
    // Route::get('services/create', [ServiceController::class, 'create'])->name('services.create');
    // Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    // Route::get('services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
    // Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    // Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
