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
        $payments = Payment::with('paymentMethod', 'consultations.patient', 'patientSubscriptions.patient')->get();
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
        $patientId = $request->patient_id;
        $paymentAmount = $request->amount;
        $paymentType = $request->payment_type;

        $patient = Patient::findOrFail($patientId);

        // Crédito disponible antes del pago
        $initialCredit = $patient->credit ?? 0;

        // Total disponible para pagar = crédito + monto pagado ahora
        $totalAvailable = $initialCredit + $paymentAmount;

        // Crear el pago con monto real pagado (sin incluir crédito)
        $payment = Payment::create([
            'patient_id' => $patientId,
            'payment_method_id' => $request->payment_method_id,
            'amount' => $paymentAmount,
            'status' => 'pendiente',
            'reference' => $request->reference,
            'notes' => $request->notes,
            'payment_type' => $paymentType,
        ]);

        $remainingPayment = $totalAvailable; // Usamos crédito + pago actual

        // Obtener ítems seleccionados antes de aplicar pago
        if ($paymentType === 'consulta') {
            $items = Consultation::whereIn('id', $request->consultation_ids)
                ->where('patient_id', $patientId)
                ->orderBy('id')
                ->get();
        } else {
            $items = PatientSubscription::whereIn('id', $request->subscription_ids)
                ->where('patient_id', $patientId)
                ->with('subscription')
                ->get();
        }

        // Calcular total seleccionado y total pagado antes de este pago
        $totalSelectedAmount = 0;
        $totalPaidBefore = 0;

        foreach ($items as $item) {
            if ($paymentType === 'consulta') {
                $totalSelectedAmount += $item->amount;
                $totalPaidBefore += $item->amount_paid;
            } else {
                $price = $item->subscription->price ?? 0;
                $totalSelectedAmount += $price;
                $totalPaidBefore += $item->amount_paid;
            }
        }

        // Aplicar el pago (crédito + pago actual) a cada ítem y actualizar estado
        foreach ($items as $item) {
            if ($paymentType === 'consulta') {
                $pendingAmount = $item->amount - $item->amount_paid;
            } else {
                $price = $item->subscription->price ?? 0;
                $pendingAmount = $price - $item->amount_paid;
            }

            if ($remainingPayment <= 0) {
                break;
            }

            if ($pendingAmount <= 0) {
                continue; // Ya pagado
            }

            if ($remainingPayment >= $pendingAmount) {
                if ($paymentType === 'consulta') {
                    $item->amount_paid = $item->amount;
                    $item->payment_status = 'pagado';
                } else {
                    $item->amount_paid = $price;
                    $item->payment_status = 'pagado';
                }
                $remainingPayment -= $pendingAmount;
            } else {
                if ($paymentType === 'consulta') {
                    $item->amount_paid += $remainingPayment;
                    $item->payment_status = 'parcial';
                } else {
                    $item->amount_paid += $remainingPayment;
                    $item->payment_status = 'parcial';
                }
                $remainingPayment = 0;
            }

            $item->save();
        }

        // Sincronizar relaciones entre pago y consultas o suscripciones
        if ($paymentType === 'consulta') {
            $payment->consultations()->sync($request->consultation_ids);
        } else {
            $payment->patientSubscriptions()->sync($request->subscription_ids);
        }

        // Crédito usado = crédito inicial menos crédito restante (o 0)
        $usedCredit = max(0, $initialCredit - max(0, $remainingPayment));

        // Actualizar crédito del paciente
        $patient->credit = max(0, $initialCredit - $usedCredit);

        // Si quedó saldo a favor (después de usar crédito y pago actual), acumularlo
        if ($remainingPayment > 0) {
            $patient->credit += $remainingPayment;
        }

        // Calcular deuda pendiente actualizada
        $totalConsultationsDebt = Consultation::where('patient_id', $patientId)
            ->sum(DB::raw('amount - amount_paid'));

        $totalSubscriptionsDebt = PatientSubscription::where('patient_id', $patientId)
            ->join('subscriptions', 'patient_subscriptions.subscription_id', '=', 'subscriptions.id')
            ->sum(DB::raw('subscriptions.price - patient_subscriptions.amount_paid'));

        $totalDebt = $totalConsultationsDebt + $totalSubscriptionsDebt;

        // Guardar balance como deuda pendiente (negativa o cero)
        $patient->balance = $totalDebt > 0 ? -$totalDebt : 0;

        $patient->save();

        // Construir mensaje específico para pagos parciales acumulativos con crédito usado
        $message = "Pago de {$paymentType}s: total = $".number_format($totalSelectedAmount, 2).
            ", pagado antes = $".number_format($totalPaidBefore, 2).
            ", pagado en este pago = $".number_format($paymentAmount, 2).". ";

        if ($usedCredit > 0) {
            $message .= "Crédito usado en este pago: $".number_format($usedCredit, 2).". ";
        }

        $totalPaidAfter = $totalPaidBefore + $paymentAmount + $usedCredit;

        if ($totalPaidAfter < $totalSelectedAmount) {
            $restante = $totalSelectedAmount - $totalPaidAfter;
            $message .= "Pago parcial, restante por pagar $".number_format($restante, 2).".";
        } elseif ($totalPaidAfter == $totalSelectedAmount) {
            $message .= "Pago completo.";
        } elseif ($totalPaidAfter > $totalSelectedAmount) {
            $aFavor = $totalPaidAfter - $totalSelectedAmount;
            $message .= "Pago completo, $".number_format($aFavor, 2)." a favor de crédito.";
        }

        $message .= " Crédito disponible: $".number_format($patient->credit ?? 0, 2).".";

        PatientBalanceTransaction::create([
            'patient_id' => $patient->id,
            'payment_id' => $payment->id,
            'amount' => $paymentAmount,
            'type' => $paymentType === 'consulta' ? 'pago_consulta' : 'pago_suscripcion',
            'description' => $message,
        ]);
    });

    return redirect()->route('payments.index')->with('success', 'Pago creado con éxito.');
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
