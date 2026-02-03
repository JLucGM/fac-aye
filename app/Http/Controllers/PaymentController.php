<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Consultation;
use App\Models\Patient;
use App\Models\PatientBalanceTransaction;
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
        $payments = Payment::with('paymentMethod', 'consultations.patient', 'patientSubscriptions.patient')->latest()->get();
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

        $patient = Patient::lockForUpdate()->findOrFail($request->patient_id);

        $paymentType   = $request->payment_type;
        $paymentAmount = (float) $request->amount;
        $initialCredit = (float) ($patient->credit ?? 0);

        /*
        |--------------------------------------------------------------------------
        | 1. Obtener ítems seleccionados
        |--------------------------------------------------------------------------
        */
        if ($paymentType === 'consulta') {
            $items = Consultation::whereIn('id', $request->consultation_ids)
                ->where('patient_id', $patient->id)
                ->orderBy('id')
                ->get();
        } else {
            $items = PatientSubscription::whereIn('id', $request->subscription_ids)
                ->where('patient_id', $patient->id)
                ->with('subscription')
                ->get();
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Calcular deuda total seleccionada
        |--------------------------------------------------------------------------
        */
        $totalDebtSelected = 0;

        foreach ($items as $item) {
            if ($paymentType === 'consulta') {
                $totalDebtSelected += max(0, $item->amount - $item->amount_paid);
            } else {
                $price = (float) ($item->subscription->price ?? 0);
                $totalDebtSelected += max(0, $price - $item->amount_paid);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Usar crédito existente primero
        |--------------------------------------------------------------------------
        */
        $creditUsed = min($initialCredit, $totalDebtSelected);
        $patient->credit = $initialCredit - $creditUsed;

        $remainingDebt = $totalDebtSelected - $creditUsed;
        $remainingPayment = $paymentAmount;

        /*
        |--------------------------------------------------------------------------
        | 4. Crear el pago (SOLO dinero nuevo)
        |--------------------------------------------------------------------------
        */
        $payment = Payment::create([
            'patient_id'        => $patient->id,
            'payment_method_id'=> $request->payment_method_id,
            'amount'            => $paymentAmount,
            'status'            => $request->status,
            'reference'         => $request->reference,
            'notes'             => $request->notes,
            'payment_type'      => $paymentType,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 5. Aplicar pago a los ítems
        |--------------------------------------------------------------------------
        */
        foreach ($items as $item) {

            if ($remainingPayment <= 0) {
                break;
            }

            if ($paymentType === 'consulta') {
                $pending = $item->amount - $item->amount_paid;
            } else {
                $price   = (float) ($item->subscription->price ?? 0);
                $pending = $price - $item->amount_paid;
            }

            if ($pending <= 0) {
                continue;
            }

            $paying = min($pending, $remainingPayment);

            $item->amount_paid += $paying;
            $remainingPayment -= $paying;

            if ($item->amount_paid >= ($paymentType === 'consulta'
                ? $item->amount
                : $price)) {
                $item->payment_status = 'pagado';
            } else {
                $item->payment_status = 'parcial';
            }

            $item->save();
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Si sobra dinero, se convierte en crédito
        |--------------------------------------------------------------------------
        */
        if ($remainingPayment > 0) {
            $patient->credit += $remainingPayment;
        }

        /*
        |--------------------------------------------------------------------------
        | 7. Recalcular balance total (deuda real)
        |--------------------------------------------------------------------------
        */
        $consultationsDebt = Consultation::where('patient_id', $patient->id)
            ->sum(DB::raw('amount - amount_paid'));

        $subscriptionsDebt = PatientSubscription::where('patient_id', $patient->id)
            ->join('subscriptions', 'patient_subscriptions.subscription_id', '=', 'subscriptions.id')
            ->sum(DB::raw('subscriptions.price - patient_subscriptions.amount_paid'));

        $totalDebt = $consultationsDebt + $subscriptionsDebt;

        $patient->balance = $totalDebt > 0 ? -$totalDebt : 0;
        $patient->save();

        /*
        |--------------------------------------------------------------------------
        | 8. Sincronizar relaciones
        |--------------------------------------------------------------------------
        */
        if ($paymentType === 'consulta') {
            $payment->consultations()->sync($request->consultation_ids);
        } else {
            $payment->patientSubscriptions()->sync($request->subscription_ids);
        }

        /*
        |--------------------------------------------------------------------------
        | 9. Log de balance
        |--------------------------------------------------------------------------
        */
        PatientBalanceTransaction::create([
            'patient_id' => $patient->id,
            'payment_id' => $payment->id,
            'amount'     => $paymentAmount,
            'type'       => $paymentType === 'consulta'
                ? 'pago_consulta'
                : 'pago_suscripcion',
            'description'=> "Pago aplicado. Crédito usado: $"
                . number_format($creditUsed, 2)
                . ". Crédito actual: $"
                . number_format($patient->credit, 2),
        ]);
    });

    return redirect()
        ->route('payments.index')
        ->with('success', 'Pago creado con éxito.');
}





    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load('paymentMethod', 'consultations.patient', 'consultations.user', 'patientSubscriptions.patient', 'patientSubscriptions.subscription');
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
        // dd($payment);
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
        $subscriptions = PatientSubscription::with('patient', 'subscription')->where('payment_status', 'pendiente')->get();
        // dd($subscriptions);
        return Inertia::render('Payments/AccountsReceivable', compact('payments', 'subscriptions'));
    }
}
