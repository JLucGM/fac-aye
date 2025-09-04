<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Service;
use App\Models\User;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.consultation.index')->only('index');
        $this->middleware('can:admin.consultation.create')->only('create', 'store');
        $this->middleware('can:admin.consultation.edit')->only('edit', 'update');
        $this->middleware('can:admin.consultation.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $consultations = Consultation::with(['patient', 'user'])->get();
        return Inertia::render('Consultations/Index', compact('consultations'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $patients = Patient::with('subscriptions.subscription')->get();
        $users = User::all();
        $services = Service::all(); // Assuming you have a Service model
        $paymentMethods = PaymentMethod::where('active', 1)->get();

        return Inertia::render('Consultations/Create', compact('patients', 'users', 'services', 'paymentMethods'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsultationRequest $request)
    {
        $validated = $request->validated();
        $useSubscription = $request->subscription_use === 'yes';

        if ($useSubscription) {
            $patient = Patient::with('activeSubscription')->find($validated['patient_id']);

            if ($patient->activeSubscription) {
                $subscription = $patient->activeSubscription;
                $subscription->increment('consultations_used');
                $subscription->decrement('consultations_remaining');

                if ($subscription->consultations_remaining <= 0) {
                    $subscription->update(['status' => 'inactive']);
                }

                $validated['patient_subscription_id'] = $subscription->id;

                // En este caso, no usamos servicios seleccionados, sino la suscripción
                $services = collect([[
                    'id' => null,
                    'name' => $subscription->subscription->name,
                    'price' => 0,
                ]]);
            } else {
                // No hay suscripción activa, lanzar error o manejar caso
                return back()->withErrors(['subscription_use' => 'No hay suscripción activa para este paciente.']);
            }
        } else {
            // Usar servicios seleccionados normalmente
            $services = Service::whereIn('id', $request->service_id)->get()
                ->map(fn($service) => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => $service->price,
                ]);
        }

        $consultation = Consultation::create($validated);
        $consultation->services = $services;
        $consultation->save();

        return redirect()->route('consultations.edit', $consultation);
    }


    /**
     * Display the specified resource.
     */
    public function show(Consultation $consultation)
    {
        return Inertia::render('Consultations/Show', compact('consultation'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consultation $consultation)
    {
        // Cargar los datos relacionados, incluyendo las suscripciones del paciente
        $consultation->load('patient.subscriptions.subscription', 'user', 'payment', 'medicalRecords');
        $consultation->services = json_decode($consultation->services, true); // Decodificar el JSON a un array
        $patients = Patient::all();
        $users = User::all();
        $services = Service::all();

        return Inertia::render('Consultations/Edit', compact('consultation', 'patients', 'users', 'services'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConsultationRequest $request, Consultation $consultation)
    {
        $data = $request->validated();

        $hadSubscription = $consultation->patient_subscription_id !== null;
        $usingSubscriptionNow = $data['subscription_use'] === 'yes';
        // dd($hadSubscription);
        $patient = Patient::with('activeSubscription.subscription')->find($data['patient_id']);
        $subscription = $patient?->activeSubscription;

        // Variable para asignar el patient_subscription_id final
        $newPatientSubscriptionId = $consultation->patient_subscription_id;

        if ($usingSubscriptionNow && !$hadSubscription) {
            // Pasó de NO usar suscripción a USAR suscripción
            if ($subscription) {
                // Descontar consulta usada
                $subscription->consultations_used = ($subscription->consultations_used ?? 0) + 1;
                $subscription->consultations_remaining = max(0, ($subscription->consultations_remaining ?? 0) - 1);

                if ($subscription->consultations_remaining <= 0) {
                    $subscription->status = 'inactive';
                }

                $subscription->save();

                $newPatientSubscriptionId = $subscription->id;
            } else {
                return back()->withErrors(['subscription_use' => 'El paciente no tiene una suscripción activa.']);
            }
        } elseif (!$usingSubscriptionNow && $hadSubscription) {
            // Guardar el id actual antes de eliminarlo
            $oldSubscriptionId = $consultation->patient_subscription_id;

            $oldSubscription = \App\Models\PatientSubscription::find($oldSubscriptionId);
            if ($oldSubscription) {
                $oldSubscription->consultations_used = max(0, ($oldSubscription->consultations_used ?? 0) - 1);
                $oldSubscription->consultations_remaining = ($oldSubscription->consultations_remaining ?? 0) + 1;

                if ($oldSubscription->consultations_remaining > 0 && $oldSubscription->status === 'inactive') {
                    $oldSubscription->status = 'active';
                }

                $oldSubscription->save();
            }

            // Ahora sí eliminar la relación en la consulta
            $newPatientSubscriptionId = null;
        }

        // Si no cambia el uso de suscripción, no modificamos contadores ni suscripción

        // Construir array de servicios con precios ajustados
        $servicesData = [];

        if ($usingSubscriptionNow) {
            if ($subscription) {
                $servicesData[] = [
                    'id' => null,
                    'name' => $subscription->subscription->name,
                    'price' => 0,
                ];
            }
        } else {
            $servicesData = Service::whereIn('id', $data['service_id'])
                ->get()
                ->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                        'price' => $service->price,
                    ];
                })->toArray();
        }

        // Actualizar la consulta con los datos y el patient_subscription_id corregido
        $consultation->update([
            'user_id' => $data['user_id'],
            'patient_id' => $data['patient_id'],
            'status' => $data['status'],
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'notes' => $data['notes'] ?? null,
            'payment_status' => $data['payment_status'],
            'consultation_type' => $data['consultation_type'],
            'amount' => $data['amount'] ?? 0,
            'services' => json_encode($servicesData),
            'patient_subscription_id' => $newPatientSubscriptionId,
        ]);

        return redirect()->route('consultations.edit', $consultation)
            ->with('success', 'Consulta actualizada con éxito.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Consultation $consultation)
    {
        $consultation->delete();
        return redirect()->route('consultations.index');
    }
}
