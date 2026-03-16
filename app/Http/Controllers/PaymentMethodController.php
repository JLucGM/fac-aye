<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Http\Requests\StorePaymentMethodRequest;
use App\Http\Requests\UpdatePaymentMethodRequest;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
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
    public function index(Request $request)
    {
        $search = $request->input('search');

        $paymentMethods = PaymentMethod::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        return Inertia::render('PaymentMethods/Index', [
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('PaymentMethods/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentMethodRequest $request)
    {
        PaymentMethod::create($request->validated());
        return redirect()->route('payment-methods.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentMethod $paymentMethod)
    {
        return Inertia::render('PaymentMethods/Show', compact('paymentMethod'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMethod $paymentMethod)
    {
        return Inertia::render('PaymentMethods/Edit', compact('paymentMethod'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentMethodRequest $request, PaymentMethod $paymentMethod)
    {
        // dd($request->all());
        $paymentMethod->update($request->validated());
        return redirect()->route('payment-methods.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();
        return redirect()->route('payment-methods.index');
    }
}
