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
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.invoice.index')->only('index');
        $this->middleware('can:admin.invoice.create')->only('create', 'store');
        $this->middleware('can:admin.invoice.edit')->only('edit', 'update');
        $this->middleware('can:admin.invoice.delete')->only('destroy');
    }
    
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
            // 'invoice_img' => 'nullable'
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

        // if ($request->hasFile('invoice_img')) {
        //     // Eliminar la imagen anterior de la colección 'invoice_img'
        //     $invoice->clearMediaCollection('invoice_img');

        //     // Agregar la nueva imagen a la colección 'invoice_img'
        //     $invoice->addMultipleMediaFromRequest(['invoice_img'])
        //         ->each(function ($fileAdder) {
        //             $fileAdder->toMediaCollection('invoice_img');
        //         });
        // }

        // 5. Redirigir con un mensaje de éxito
        return redirect()->route('invoices.edit', $invoice)->with('success', 'Factura creada con éxito.');
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
            'items', // Para los ítems, cargar la consulta y su paciente asociado
            'media'
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
        // Validar todos los campos, incluyendo los ítems y la imagen
        $validatedData = $request->validate([
            'patient_id' => 'nullable|exists:patients,id',
            'invoice_number' => 'nullable|string|max:255',
            'invoice_date' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'items' => 'nullable|array|min:1',
            'items.*.id' => 'nullable|exists:invoice_items,id',
            'items.*.service_name' => 'nullable|string|max:255',
            'items.*.quantity' => 'nullable|integer|min:1',
            'items.*.unit_price' => 'nullable|numeric|min:0',
            'items.*.line_total' => 'nullable|numeric|min:0',
            // 'invoice_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Actualizar datos principales de la factura
        $invoice->update([
            'invoice_number' => $validatedData['invoice_number'],
            'patient_id' => $validatedData['patient_id'],
            'invoice_date' => $validatedData['invoice_date'],
            'notes' => $validatedData['notes'],
            'payment_method_id' => $validatedData['payment_method_id'],
        ]);

        // Sincronizar ítems de la factura
        $sentItemIds = collect($validatedData['items'])->pluck('id')->filter()->all();

        // Eliminar ítems que no están en la petición
        $invoice->items()->whereNotIn('id', $sentItemIds)->delete();

        // Crear o actualizar ítems
        foreach ($validatedData['items'] as $itemData) {
            if (isset($itemData['id'])) {
                // Actualizar ítem existente
                $invoice->items()->where('id', $itemData['id'])->update([
                    'service_name' => $itemData['service_name'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'line_total' => $itemData['line_total'],
                ]);
            } else {
                // Crear nuevo ítem
                $invoice->items()->create([
                    'service_name' => $itemData['service_name'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'line_total' => $itemData['line_total'],
                ]);
            }
        }

        // Actualizar total_amount de la factura
        $totalAmount = collect($validatedData['items'])->sum('line_total');
        $invoice->update(['total_amount' => $totalAmount]);

        // Manejar la imagen adjunta (opcional)
        // if ($request->hasFile('invoice_img')) {
        //     $invoice->clearMediaCollection('invoice_img');
        //     $invoice->addMediaFromRequest('invoice_img')
        //         ->toMediaCollection('invoice_img');
        // }

        // Redirigir con mensaje de éxito
        return redirect()->route('invoices.edit', $invoice)->with('success', 'Factura actualizada con éxito.');
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
        $invoice->load(['patient', 'items']);
        $fechaHoy = Carbon::today();
        $auth = Auth::user(); // Usuario autenticado que genera el PDF
        $settings = Setting::with('media')->first(); // Obtener la configuración de la empresa
        
        $pdf = Pdf::loadView('pdf.invoicepdf', compact('invoice', 'fechaHoy', 'settings', 'auth'))->setPaper('a4');
        // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream('factura_' . $invoice->invoice_number . '.pdf', ['Attachment' => 0]);
    }
}
