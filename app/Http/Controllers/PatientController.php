<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Doctor;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\PatientBalanceTransaction;
use App\Models\PatientSubscription;
use App\Models\Setting;
use App\Models\Subscription;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.patient.index')->only('index');
        $this->middleware('can:admin.patient.create')->only('create', 'store');
        $this->middleware('can:admin.patient.edit')->only('edit', 'update');
        $this->middleware('can:admin.patient.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = Patient::with('subscriptions')->get();
        return Inertia::render('Patients/Index', compact('patients'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $doctors = Doctor::all();
        $subscriptions = Subscription::all(); // Solo suscripciones activas

        return Inertia::render('Patients/Create', compact('doctors', 'subscriptions'));
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StorePatientRequest $request)
    {
        // Validar los datos del paciente
        $validatedPatientData = $request->validated();

        // Validar datos adicionales para la suscripción si existe
        $validatedSubscriptionData = [];
        $patientSubscription = null;

        if ($request->filled('subscription_id')) {
            $request->validate([
                'subscription_id' => 'exists:subscriptions,id'
            ]);

            $subscription = Subscription::find($request->subscription_id);
            $validatedSubscriptionData = [
                'start_date' => now(),
                'end_date' => $this->calculateEndDate($subscription->type),
                'consultations_remaining' => $subscription->consultations_allowed,
                'status' => 'active'
            ];
        }

        // Usar transacción para asegurar consistencia
        DB::transaction(function () use ($validatedPatientData, $request, $validatedSubscriptionData, &$patientSubscription) {
            // Crear el paciente
            $patient = Patient::create($validatedPatientData);

            // Crear la relación en la tabla pivote si hay suscripción
            if ($request->filled('subscription_id')) {
                $patientSubscription = $patient->subscriptions()->create(array_merge(
                    ['subscription_id' => $request->subscription_id],
                    $validatedSubscriptionData
                ));

                // Registrar movimiento financiero por la suscripción
                $subscription = Subscription::find($request->subscription_id);
                PatientBalanceTransaction::create([
                    'patient_id' => $patient->id,
                    'patient_subscription_id' => $patientSubscription->id,
                    'amount' => -$subscription->price, // deuda por la suscripción
                    'type' => 'funcional_deuda',
                    'description' => "Deuda por suscripción #{$patientSubscription->id}",
                ]);

                // Actualizar el balance del paciente
                $patient->balance = ($patient->balance ?? 0) - $subscription->price;
                $patient->save();
            }
        });


        return redirect()->route('patients.index')
            ->with('success', 'Paciente creado exitosamente');
    }

    // Función auxiliar para calcular fecha de fin
    protected function calculateEndDate(string $subscriptionType): \DateTime
    {
        return match ($subscriptionType) {
            'semanal' => now()->addWeek(),
            'mensual' => now()->addMonth(),
            'anual' => now()->addYear(),
            default => now()->addMonth() // Valor por defecto
        };
    }

    public function show(Patient $patient)
    {
        // Cargar solo los últimos 10 registros para no saturar el SSR
        $patient->load([
            'consultations' => function ($query) {
                $query->with(['subscription.subscription', 'payment'])
                    ->latest()
                    ->limit(10);
            },
            'medicalRecords' => function ($query) {
                $query->latest()->limit(5);
            }
        ]);

        $subscriptions = $patient->subscriptions()
            ->with('subscription')
            ->latest()
            ->get();

        $settings = Setting::with('media')->first();

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
            'subscriptions' => $subscriptions,
            'settings' => $settings
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        $doctors = Doctor::all();
        $subscriptions = Subscription::all(); // Cargar todas las suscripciones disponibles
        $patient->load('subscriptions'); // Cargar las suscripciones del paciente

        return Inertia::render('Patients/Edit', compact('patient', 'doctors', 'subscriptions'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient)
    {
        // 1. Actualizar datos básicos del paciente
        $patient->update($request->validated());

        $message = 'Paciente actualizado exitosamente';

        // 2. Manejo de suscripción (si se proporciona subscription_id)
        if ($request->filled('subscription_id')) {
            $subscription = Subscription::findOrFail($request->subscription_id);

            // Buscar suscripción activa existente (si hay)
            $currentSubscription = $patient->subscriptions()
                ->where('status', 'active')
                ->first();

            // Determinar si es una renovación o nueva suscripción
            $isRenewal = $currentSubscription && ($currentSubscription->subscription_id == $subscription->id);

            if ($currentSubscription) {
                // Marcar la anterior como inactiva
                $currentSubscription->update([
                    'status' => 'inactive',
                    'end_date' => now()
                ]);
            }

            // Crear NUEVO registro de suscripción (siempre se crea uno nuevo)
            $newSubscription = $patient->subscriptions()->create([
                'subscription_id' => $subscription->id,
                'start_date' => now(),
                'end_date' => $this->calculateEndDate($subscription->type),
                'consultations_remaining' => $subscription->consultations_allowed,
                'consultations_used' => 0, // Resetear consultas usadas
                'status' => 'active'
            ]);

            // Registrar movimiento financiero por la suscripción
            PatientBalanceTransaction::create([
                'patient_id' => $patient->id,
                'patient_subscription_id' => $newSubscription->id,
                'amount' => -$subscription->price, // deuda por la suscripción
                'type' => 'funcional_deuda',
                'description' => $isRenewal
                    ? "Deuda por renovación de suscripción #{$newSubscription->id}"
                    : "Deuda por nueva suscripción #{$newSubscription->id}",
            ]);

            // Actualizar el balance del paciente
            $patient->balance = ($patient->balance ?? 0) - $subscription->price;
            $patient->save();

            // Mensaje personalizado según el caso
            $message = $isRenewal
                ? 'Suscripción renovada exitosamente'
                : 'Nueva suscripción creada exitosamente';
        } else {
            // Si no viene subscription_id, desactivar cualquier suscripción activa
            $patient->subscriptions()
                ->where('status', 'active')
                ->update([
                    'status' => 'inactive',
                    'end_date' => now()
                ]);

            $message = 'Paciente actualizado exitosamente';
        }

        return redirect()
            ->route('patients.index')
            ->with('success', $message);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();
        return redirect()->route('patients.index');
    }

    public function subscriptionpatientstore()
    {
        $patients = Patient::with('subscriptions')
            ->whereDoesntHave('activeSubscription') // Filtrar pacientes con suscripción activa
            ->get();
        $subscriptions = Subscription::all();

        return Inertia::render('Patients/subscriptionpatient', compact('patients', 'subscriptions'));
    }

    /**
     * Método dedicado solo para actualización/renovación de suscripciones
     * Verifica que no existan múltiples activas y crea una nueva suscripción,
     * desactivando la anterior si existía.
     */
    public function updateSubscription(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'patient_id' => 'required|exists:patients,id',
        ]);

        // Buscar la suscripción seleccionada
        $newSubscription = Subscription::findOrFail($request->subscription_id);
        $patient = Patient::findOrFail($request->patient_id);

        // Buscar suscripción activa actual (si existe)
        $currentActiveSubscription = $patient->subscriptions()
            ->where('status', 'active')
            ->first();

        // Verificar integridad: no debe haber más de una activa
        if ($patient->subscriptions()->where('status', 'active')->count() > 1) {
            return back()->withErrors(['error' => 'El paciente tiene múltiples suscripciones activas. Contacte al administrador.']);
        }

        // Determinar tipo de operación (renovación si es la misma suscripción)
        $isRenewal = $currentActiveSubscription &&
            ($currentActiveSubscription->subscription_id == $newSubscription->id);

        try {
            DB::transaction(function () use ($patient, $currentActiveSubscription, $newSubscription, $isRenewal) {
                // Desactivar suscripción actual si existe
                if ($currentActiveSubscription) {
                    $currentActiveSubscription->update([
                        'status' => 'inactive',
                        'end_date' => now(),
                    ]);
                }

                // Crear siempre nueva suscripción (renovación o nueva)
                $createdSubscription = $patient->subscriptions()->create([
                    'subscription_id' => $newSubscription->id,
                    'start_date' => now(),
                    'end_date' => $this->calculateEndDate($newSubscription->type),
                    'consultations_remaining' => $newSubscription->consultations_allowed,
                    'consultations_used' => 0,
                    'status' => 'active',
                ]);

                // Registrar movimiento financiero por la suscripción
                PatientBalanceTransaction::create([
                    'patient_id' => $patient->id,
                    'patient_subscription_id' => $createdSubscription->id,
                    'amount' => -$newSubscription->price,
                    'type' => 'suscripcion',
                    'description' => $isRenewal
                        ? "Deuda por renovación de suscripción #{$createdSubscription->id}"
                        : "Deuda por nueva suscripción #{$createdSubscription->id}",
                ]);

                // Actualizar balance del paciente
                $patient->balance = ($patient->balance ?? 0) - $newSubscription->price;
                $patient->save();
            });

            $message = $isRenewal
                ? 'Suscripción renovada exitosamente.'
                : 'Nueva suscripción creada exitosamente.';

            return redirect()->route('patients.index')->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al procesar la suscripción: ' . $e->getMessage()]);
        }
    }

    public function showBalanceTransactions(Patient $patient)
    {
        $patient->load(['patientBalanceTransactions' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return Inertia::render('Patients/ShowBalanceTransactions', compact('patient'));
    }

    /**
     * Update patient balance and credit.
     */
    public function updateBalance(Request $request, Patient $patient)
    {
        $request->validate([
            'balance' => 'required|numeric|min:-999999.99|max:999999.99',
            'credit' => 'required|numeric|min:0|max:999999.99',
            'description' => 'required|string|max:1000',
        ]);

        // Usamos DB::transaction para asegurar que todos los registros se creen correctamente
        DB::transaction(function () use ($request, $patient) {

            /**
             * OPCIÓN NATIVA:
             * Restamos los valores convirtiéndolos a float y formateamos a 2 decimales 
             * para evitar errores de precisión y asegurar compatibilidad total.
             */
            $balanceDifference = number_format((float)$request->balance - (float)$patient->balance, 2, '.', '');
            $creditDifference  = number_format((float)$request->credit - (float)$patient->credit, 2, '.', '');

            // Registrar transacción para balance si hay cambio
            // Comparamos contra 0.00 para detectar cambios reales
            if ($balanceDifference != '0.00') {
                PatientBalanceTransaction::create([
                    'patient_id'  => $patient->id,
                    'amount'      => $balanceDifference,
                    'type'        => 'balance_adjustment',
                    'description' => $request->description . ' (Ajuste de balance: ' .
                        ($balanceDifference > 0 ? '+' : '') . $balanceDifference . ')',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            // Registrar transacción para crédito si hay cambio
            if ($creditDifference != '0.00') {
                PatientBalanceTransaction::create([
                    'patient_id'  => $patient->id,
                    'amount'      => $creditDifference,
                    'type'        => 'credit_adjustment',
                    'description' => $request->description . ' (Ajuste de crédito: ' .
                        ($creditDifference > 0 ? '+' : '') . $creditDifference . ')',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            // Actualizar datos del paciente
            $patient->update([
                'balance' => $request->balance,
                'credit'  => $request->credit,
            ]);
        });

        return redirect()->back()
            ->with('success', 'Balance y crédito actualizados exitosamente.');
    }
}
