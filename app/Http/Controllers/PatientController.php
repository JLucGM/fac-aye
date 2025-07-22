<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Doctor;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\PatientSubscription;
use App\Models\Setting;
use App\Models\Subscription;
use Illuminate\Routing\Controller;
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
    // public function store(StorePatientRequest $request)
    // {
    //     // dd($request->all());
    //     $validatedData = $request->validated();

    //     // Crear el paciente
    //     $patient = Patient::create($validatedData);

    //     // Si se proporciona una suscripción, crearla
    //     if ($request->subscription_id) {
    //         PatientSubscription::create([
    //             'patient_id' => $patient->id,
    //             'subscription_id' => $request->subscription_id,
    //             'start_date' => now(), // Puedes establecer la fecha de inicio
    //             'end_date' => null, // O establecer una fecha de finalización si es necesario
    //             'consultations_used' => 0, // Inicializa según tu lógica
    //             'consultations_remaining' => 0, // Inicializa según tu lógica
    //             'status' => 'active', // O el estado que desees
    //         ]);
    //     }

    //     return redirect()->route('patients.index');
    // }

    public function store(StorePatientRequest $request)
    {
        // Validar los datos del paciente
        $validatedPatientData = $request->validated();

        // Validar datos adicionales para la suscripción si existe
        $validatedSubscriptionData = [];
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

        // Crear el paciente
        $patient = Patient::create($validatedPatientData);

        // Crear la relación en la tabla pivote si hay suscripción
        if ($request->filled('subscription_id')) {
            $patient->subscriptions()->create(array_merge(
                ['subscription_id' => $request->subscription_id],
                $validatedSubscriptionData
            ));
        }

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


    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        $patient->load('consultations', 'consultations.subscription.subscription', 'consultations.payment', 'doctor');
    $subscriptions = $patient->subscriptions()->with('subscription')->get();

        $settings = Setting::with('media')->first()->get();
        
        // dd($settings);
        return Inertia::render('Patients/Show', compact('patient', 'subscriptions','settings'));
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
}
