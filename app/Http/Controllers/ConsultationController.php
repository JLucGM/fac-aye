<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Models\Patient;
use App\Models\PatientBalanceTransaction;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Service;
use App\Models\User;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
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

        try {
            $consultation = DB::transaction(function () use ($validated, $useSubscription) {
                if ($useSubscription) {
                    // Lógica existente para suscripciones...
                    $patient = Patient::with('activeSubscription')->find($validated['patient_id']);

                    if (!$patient || !$patient->activeSubscription) {
                        throw new \Exception('No hay suscripción activa para este paciente.');
                    }

                    $subscription = $patient->activeSubscription;
                    $subscription->increment('consultations_used');
                    $subscription->decrement('consultations_remaining');

                    if ($subscription->consultations_remaining <= 0) {
                        $subscription->update(['status' => 'inactive']);
                    }

                    $validated['patient_subscription_id'] = $subscription->id;

                    $services = collect([[
                        'id' => null,
                        'name' => $subscription->subscription->name,
                        'price' => 0,
                    ]]);

                    $totalAmount = 0;
                    $paymentStatus = 'pagado';
                } else {
                    // Verificar si hay servicios de cortesía
                    $services = Service::whereIn('id', $validated['service_id'])->get();

                    // Verificar si AL MENOS UN servicio es de cortesía
                    $hasCourtesyService = $services->where('is_courtesy', true)->isNotEmpty();

                    // Calcular total (si hay servicio de cortesía, total = 0)
                    if ($hasCourtesyService) {
                        $totalAmount = 0;
                        $paymentStatus = 'pagado';
                    } else {
                        $totalAmount = $services->sum('price');
                        $paymentStatus = 'pendiente';
                    }

                    // Transformar servicios para guardar
                    $services = $services->map(fn($service) => [
                        'id' => $service->id,
                        'name' => $service->name,
                        'price' => $service->price,
                        'is_courtesy' => $service->is_courtesy ?? false,
                    ]);
                }

                // Crear la consulta
                $consultation = Consultation::create(array_merge($validated, [
                    'amount' => $totalAmount,
                    'payment_status' => $paymentStatus,
                    'services' => json_encode($services),
                ]));

                // Solo registrar deuda si NO es suscripción y NO es de cortesía
                if (!$useSubscription && !$hasCourtesyService && $totalAmount > 0) {
                    $patient = Patient::find($validated['patient_id']);
                    $patient->balance -= $totalAmount;
                    $patient->save();

                    PatientBalanceTransaction::create([
                        'patient_id' => $patient->id,
                        'consultation_id' => $consultation->id,
                        'amount' => -$totalAmount,
                        'type' => 'consulta_deuda',
                        'description' => "Deuda por consulta #{$consultation->id}",
                    ]);
                }

                return $consultation;
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        if (!$consultation) {
            return back()->withErrors(['error' => 'No se pudo crear la consulta.']);
        }

        return redirect()->route('consultations.edit', $consultation->id);
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

        $patient = Patient::with('activeSubscription.subscription')->find($data['patient_id']);
        $subscription = $patient?->activeSubscription;

        $newPatientSubscriptionId = $consultation->patient_subscription_id;

        // Guardar monto y servicios anteriores para comparar
        $oldAmount = $consultation->amount;
        $oldServices = json_decode($consultation->services, true) ?? [];

        // 1. Manejar cambio de uso de suscripción (mantener lógica existente)
        if ($usingSubscriptionNow && !$hadSubscription) {
            // De NO usar suscripción a USAR suscripción
            if (!$subscription) {
                return back()->withErrors(['subscription_use' => 'El paciente no tiene una suscripción activa.']);
            }

            $subscription->consultations_used = ($subscription->consultations_used ?? 0) + 1;
            $subscription->consultations_remaining = max(0, ($subscription->consultations_remaining ?? 0) - 1);

            if ($subscription->consultations_remaining <= 0) {
                $subscription->status = 'inactive';
            }

            $subscription->save();

            $newPatientSubscriptionId = $subscription->id;
        } elseif (!$usingSubscriptionNow && $hadSubscription) {
            // De USAR suscripción a NO usar suscripción
            $oldSubscription = \App\Models\PatientSubscription::find($consultation->patient_subscription_id);
            if ($oldSubscription) {
                $oldSubscription->consultations_used = max(0, ($oldSubscription->consultations_used ?? 0) - 1);
                $oldSubscription->consultations_remaining = ($oldSubscription->consultations_remaining ?? 0) + 1;

                if ($oldSubscription->consultations_remaining > 0 && $oldSubscription->status === 'inactive') {
                    $oldSubscription->status = 'active';
                }

                $oldSubscription->save();
            }

            $newPatientSubscriptionId = null;
        }

        // 2. Construir array de servicios y calcular monto nuevo
        if ($usingSubscriptionNow) {
            if ($subscription) {
                $servicesData = [[
                    'id' => null,
                    'name' => $subscription->subscription->name,
                    'price' => 0,
                    'is_courtesy' => false,
                ]];
                $newAmount = 0;
                $paymentStatus = 'pagado';
            }
        } else {
            $services = Service::whereIn('id', $data['service_id'])->get();

            // Verificar si hay servicios de cortesía
            $hasCourtesyService = $services->where('is_courtesy', true)->isNotEmpty();

            // Transformar servicios
            $servicesData = $services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => $service->price,
                    'is_courtesy' => $service->is_courtesy ?? false,
                ];
            })->toArray();

            // Calcular monto y estado de pago
            if ($hasCourtesyService) {
                $newAmount = 0;
                $paymentStatus = 'pagado';
            } else {
                $newAmount = collect($servicesData)->sum('price');
                $paymentStatus = $data['payment_status'] ?? 'pendiente';
            }
        }

        // 3. Actualizar consulta con nuevos datos
        $consultation->update([
            'user_id' => $data['user_id'],
            'patient_id' => $data['patient_id'],
            'status' => $data['status'],
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'notes' => $data['notes'] ?? null,
            'payment_status' => $paymentStatus,
            'consultation_type' => $data['consultation_type'],
            'amount' => $newAmount,
            'services' => json_encode($servicesData),
            'patient_subscription_id' => $newPatientSubscriptionId,
        ]);

        // 4. Ajustar balance y registrar movimientos financieros si hay diferencia
        // SOLO si NO es de cortesía y NO usa suscripción
        if (!$hasCourtesyService && !$usingSubscriptionNow) {
            $debtDifference = $newAmount - $oldAmount;

            if ($debtDifference != 0) {
                $patient->balance = ($patient->balance ?? 0) - $debtDifference;
                $patient->save();

                PatientBalanceTransaction::create([
                    'patient_id' => $patient->id,
                    'consultation_id' => $consultation->id,
                    'amount' => -$debtDifference,
                    'type' => 'consulta_deuda',
                    'description' => "Ajuste de deuda por consulta #{$consultation->id}",
                ]);
            }
        }

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


    /**
     * Corregir estado de pago para consultas con servicios de cortesía.
     */
    public function fixCourtesyPayment(Consultation $consultation)
{
    // Verificar que la consulta tenga servicios
    $consultationServices = json_decode($consultation->services, true) ?? [];
    
    if (empty($consultationServices)) {
        return redirect()->back()
            ->with('error', 'Esta consulta no tiene servicios.');
    }

    // Extraer IDs de servicios de la consulta
    $serviceIds = array_filter(array_column($consultationServices, 'id'));
    
    if (empty($serviceIds)) {
        return redirect()->back()
            ->with('error', 'No se pudieron identificar los servicios de esta consulta.');
    }

    // Buscar en la base de datos si alguno de estos servicios es de cortesía
    $courtesyServices = Service::whereIn('id', $serviceIds)
        ->where('is_courtesy', true)
        ->get();

    if ($courtesyServices->isEmpty()) {
        return redirect()->back()
            ->with('error', 'Esta consulta no contiene servicios marcados como cortesía en la base de datos.');
    }

    // Solo corregir si está pendiente
    if ($consultation->payment_status !== 'pendiente') {
        return redirect()->back()
            ->with('info', 'Solo se pueden corregir consultas pendientes.');
    }

    DB::transaction(function () use ($consultation) {
        $patient = $consultation->patient;
        $oldAmount = $consultation->amount;

        // Si había deuda registrada, corregirla
        if ($oldAmount > 0) {
            $debtTransactions = PatientBalanceTransaction::where('consultation_id', $consultation->id)
                ->where('type', 'consulta_deuda')
                ->get();

            foreach ($debtTransactions as $transaction) {
                if ($transaction->amount < 0) {
                    $patient->balance += abs($transaction->amount);
                }
            }
            $patient->save();

            PatientBalanceTransaction::create([
                'patient_id' => $patient->id,
                'consultation_id' => $consultation->id,
                'amount' => $oldAmount,
                'type' => 'cortesia_ajuste',
                'description' => 'Ajuste por consulta de cortesía #' . $consultation->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Actualizar la consulta
        $consultation->update([
            'payment_status' => 'pagado',
            'amount_paid' => $oldAmount,
        ]);
    });

    return redirect()->back()
        ->with('success', 'Consulta de cortesía corregida exitosamente.');
}
}
