<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Consultation;
use App\Models\Patient;
use App\Models\PatientSubscription;
use App\Models\PaymentMethod;
use App\Models\Subscription;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.paymentmethod.index')->only('index');
        $this->middleware('can:admin.paymentmethod.create')->only('create', 'store');
        $this->middleware('can:admin.paymentmethod.edit')->only('edit', 'update');
        $this->middleware('can:admin.paymentmethod.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with('paymentMethod', 'consultations.patient','patientSubscriptions.patient')->get();
        return Inertia::render('Payments/Index', compact('payments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $paymentMethods = PaymentMethod::where('active', 1)->get();
        $patients = Patient::with(['subscriptions.subscription'])->get(); // Cargar suscripciones con la relación de suscripción
        $consultations = Consultation::with('patient', 'user')->get();
        // $subscriptions = Subscription::all();

        return Inertia::render('Payments/Create', compact('paymentMethods', 'patients', 'consultations'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        DB::transaction(function () use ($request) {
            // Crear el pago
            $payment = Payment::create([
                'payment_method_id' => $request->payment_method_id,
                'amount' => $request->amount,
                'status' => $request->status,
                'reference' => $request->reference,
                'notes' => $request->notes,
            ]);

            // Procesar según el tipo de pago
            if ($request->payment_type === 'consulta') {
                // Sincronizar las consultas seleccionadas
                $payment->consultations()->sync($request->consultation_ids);

                // Actualizar el estado de las consultas
                foreach ($request->consultation_ids as $consultationId) {
                    $consultation = Consultation::find($consultationId);
                    if ($consultation) {
                        $consultation->update(['payment_status' => 'pagado']);
                    }
                }
            } elseif ($request->payment_type === 'suscripcion') {
                // Sincronizar las suscripciones seleccionadas
                $payment->patientSubscriptions()->sync($request->subscription_ids);

                foreach ($request->subscription_ids as $patientSubscriptionId) {
                    $patientSubscription = PatientSubscription::find($patientSubscriptionId);
                    if ($patientSubscription) {
                        $patientSubscription->update(['payment_status' => 'pagado']);
                    }
                }
            }
        });

        return redirect()->route('payments.index')->with('success', 'Pago creado con éxito.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load('paymentMethod', 'consultations.patient', 'consultations.user', 'patientSubscriptions.patient','patientSubscriptions.subscription');
        return Inertia::render('Payments/Show', compact('payment'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        $payment->load('consultations', 'paymentMethod', 'consultations.patient', 'consultations.user');
        $paymentMethods = PaymentMethod::where('active', 1)->get();
        $patients = Patient::all();
        $consultations = Consultation::with('patient', 'user')->get();

        return Inertia::render('Payments/Edit', compact('payment', 'paymentMethods', 'patients', 'consultations'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());

        return redirect()->route('payments.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->route('payments.index');
    }

    public function accounts_receivable_index()
    {
        $payments = Consultation::with('patient', 'user')->where('payment_status', 'pendiente')->get();
        // dd($payments);
        return Inertia::render('Payments/AccountsReceivable', compact('payments'));
    }
}
