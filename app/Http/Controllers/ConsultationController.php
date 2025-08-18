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
        $patients = Patient::with('subscriptions')->get();
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
            }
        }

        // Registrar servicios con precios REALES (ya vienen modificados desde frontend)
        $services = Service::whereIn('id', $request->service_id)->get()
            ->map(fn($service) => [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $useSubscription ? 0 : $service->price
            ]);

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
        $consultation->load('patient.subscriptions', 'user', 'payment', 'medicalRecords'); // Cargar las suscripciones del paciente
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

        // Verificar si la consulta original tenía una suscripción
        $hadSubscription = $consultation->patient_subscription_id !== null;
        $usingSubscriptionNow = $data['subscription_use'] === 'yes';

        // Si ahora se quiere usar suscripción y no tenía antes
        if ($usingSubscriptionNow && !$hadSubscription) {
            $patient = Patient::with('activeSubscription')->find($data['patient_id']);

            if ($patient && $patient->activeSubscription) {
                $subscription = $patient->activeSubscription;
                $subscription->increment('consultations_used');
                $subscription->decrement('consultations_remaining');

                if ($subscription->consultations_remaining <= 0) {
                    $subscription->update(['status' => 'inactive']);
                }

                $consultation->patient_subscription_id = $subscription->id;
            }
        }
        // Si ahora no quiere usar suscripción pero antes sí tenía
        elseif (!$usingSubscriptionNow && $hadSubscription) {
            $consultation->patient_subscription_id = null;
        }

        // Construir el array de servicios
        $servicesData = Service::whereIn('id', $request->service_id)
            ->get()
            ->map(function ($service) use ($usingSubscriptionNow) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => $usingSubscriptionNow ? 0 : $service->price
                ];
            })->toArray();

        // Actualizar todos los campos juntos
        $consultation->update([
            ...$data,
            'services' => json_encode($servicesData),
            // Otros campos que necesites actualizar
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
