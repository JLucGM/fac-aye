<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Invoice;
use App\Models\Patient;
use App\Models\PaymentMethod;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with('patient')->get();
        // dd($invoices);

        return Inertia::render('Invoices/Index', compact('invoices'));
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create()
    {
        $patients = Patient::all();
        $paymentMethods = PaymentMethod::where('active', 1)->get();

        return Inertia::render('Invoices/Create', compact('patients', 'paymentMethods'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validar los datos
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_number' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'payment_method_id' => 'required|exists:payment_methods,id', // Validación para el método de pago
            'items' => 'required|array|min:1',
            'items.*.service_name' => 'required|string|max:255', // Validación para el nombre del servicio
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.line_total' => 'required|numeric|min:0',
            'invoice_img' => 'nullable'
        ]);

        // 2. Calcular subtotal y total_amount
        $subtotal = 0;
        foreach ($validatedData['items'] as $item) {
            $subtotal += $item['line_total'];
        }
        $totalAmount = $subtotal;

        // 3. Crear la Factura
        $invoice = Invoice::create([
            'invoice_number' => $validatedData['invoice_number'],
            'patient_id' => $validatedData['patient_id'],
            'invoice_date' => $validatedData['invoice_date'],
            'total_amount' => $totalAmount,
            'notes' => $validatedData['notes'],
            'payment_method_id' => $validatedData['payment_method_id'], // Agregar el método de pago
        ]);

        // 4. Crear los Ítems de la Factura
        foreach ($validatedData['items'] as $itemData) {
            $invoice->items()->create([
                'service_name' => $itemData['service_name'], // Usar el nombre del servicio
                'quantity' => $itemData['quantity'],
                'unit_price' => $itemData['unit_price'],
                'line_total' => $itemData['line_total'],
            ]);
        }

        if ($request->hasFile('invoice_img')) {
            // Eliminar la imagen anterior de la colección 'invoice_img'
            $invoice->clearMediaCollection('invoice_img');

            // Agregar la nueva imagen a la colección 'invoice_img'
            $invoice->addMultipleMediaFromRequest(['invoice_img'])
                ->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('invoice_img');
                });
        }

        // 5. Redirigir con un mensaje de éxito
        return redirect()->route('invoices.show', $invoice)->with('success', 'Factura creada con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load('items', 'media', 'patient', 'paymentMethod');
        return Inertia::render('Invoices/Show', compact('invoice'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        // Cargar la factura con sus relaciones necesarias
        $invoice->load([
            'patient', // Para mostrar el paciente principal de la factura
            'items' // Para los ítems, cargar la consulta y su paciente asociado
        ]);
        // También necesitamos todas las listas para los selects (pacientes, consultas)
        $patients = Patient::all();
                $paymentMethods = PaymentMethod::where('active', 1)->get();

        // Cargar consultas con su paciente para el select de ítems
        return Inertia::render('Invoices/Edit', compact('invoice', 'patients', 'paymentMethods'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        // dd($request->all());
        $request->validate([
            'invoice_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validaciones
        ]);

        if ($request->hasFile('invoice_img')) {
            // Eliminar la imagen anterior de la colección 'invoice_img'
            $invoice->clearMediaCollection('invoice_img');

            // Agregar la nueva imagen a la colección 'invoice_img'
            $invoice->addMediaFromRequest('invoice_img')
                ->toMediaCollection('invoice_img');
        }

        return redirect()->back()->with('success', 'Factura actualizada con éxito.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('invoices.index');
    }

    public function invoicePdf(Invoice $invoice)
    {
        // Cargar la factura con sus relaciones necesarias para el PDF
        // Ahora solo necesitamos 'patient' y 'items'
        $invoice->load(['patient', 'items']);
        $fechaHoy = Carbon::today();
        $auth = Auth::user(); // Usuario autenticado que genera el PDF
        $settings = Setting::with('media')->first(); // Obtener la configuración de la empresa
        // Calcular subtotal y tax_amount si no están en la tabla invoices
        // Si estos campos no existen en la tabla 'invoices', deberás calcularlos aquí
        // a partir de los 'line_total' de los ítems.
        // $subtotal = $invoice->items->sum('line_total');
        // $taxRate = 0.16; // Asumiendo un 16% de IVA
        // $taxAmount = $subtotal * $taxRate;
        // Pasar estos valores calculados a la vista del PDF
        $pdf = Pdf::loadView('pdf.invoicepdf', compact('invoice', 'fechaHoy', 'settings', 'auth'))->setPaper('a4');
        // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream('factura_' . $invoice->invoice_number . '.pdf', ['Attachment' => 0]);
    }
}
