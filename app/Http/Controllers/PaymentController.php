<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Consultation;
use App\Models\Patient;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::all();
        return Inertia::render('Payments/Index', compact('payments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $paymentMethods = PaymentMethod::all();
        $patients = Patient::all();
        $consultations = Consultation::with('patient', 'user')->get();

        return Inertia::render('Payments/Create', compact('paymentMethods', 'patients', 'consultations'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
{
    // Iniciar una transacción para asegurar la integridad de los datos
    DB::transaction(function () use ($request) {
        // Crear el pago
        $payment = Payment::create([
            'payment_method_id' => $request->payment_method_id,
            'amount' => $request->amount,
            'status' => $request->status,
            'reference' => $request->reference,
            'notes' => $request->notes,
            'paid_at' => $request->paid_at,
        ]);

        // Sincronizar las consultas seleccionadas
        $payment->consultations()->sync($request->consultation_ids);

        // Actualizar el estado de las consultas
        foreach ($request->consultation_ids as $consultationId) {
            $consultation = Consultation::find($consultationId);
            if ($consultation) {
                $consultation->update(['payment_status' => 'paid']);
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
        return Inertia::render('Payments/Show', compact('payment'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        $paymentMethods = PaymentMethod::all();
        $patients = Patient::all();
        $consultations = Consultation::all();
        $payment->load('patient', 'consultation', 'paymentMethod');
        // $payment->setRelation('patient', $patients->find($payment->patient_id));
        // $payment->setRelation('consultation', $consultations->find($payment->consultation_id));
        // $payment->setRelation('paymentMethod', $paymentMethods->find($payment->payment_method_id));
        // $payment->status_label = match ($payment->status) {
        //     'pendiente' => 'Pendiente',
        //     'completado' => 'Completado',
        //     'fallido' => 'Fallido',
        //     default => 'Desconocido',
        // };
        return Inertia::render('Payments/Edit', compact('payment'));
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
}
