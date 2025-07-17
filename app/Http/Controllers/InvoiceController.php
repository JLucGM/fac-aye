<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Invoice;
use App\Models\Patient;
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
        // Cargar paciente asociado a la consulta para mostrar en el select
        $consultations = Consultation::with('patient')->get();

        return Inertia::render('Invoices/Create', compact('patients', 'consultations'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validar los datos
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            // 'items.*.service_id' => 'nullable|exists:services,id', // <-- ELIMINADO
            'items.*.consultation_id' => 'required|exists:consultations,id', // Ahora es requerido
            // 'items.*.description' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.line_total' => 'required|numeric|min:0',
        ]);

        // 2. Calcular subtotal, tax_amount y total_amount en el backend para seguridad
        $subtotal = 0;
        foreach ($validatedData['items'] as $item) {
            $subtotal += $item['line_total'];
        }
        // $taxRate = 0.16; // 16% de IVA
        // $taxAmount = $subtotal * $taxRate;
        $totalAmount = $subtotal;
        // 3. Crear la Factura
        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('YmdHis') . Str::random(4),
            'patient_id' => $validatedData['patient_id'],
            'invoice_date' => $validatedData['invoice_date'],
            'due_date' => $validatedData['due_date'],
            'subtotal' => $subtotal,
            // 'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'notes' => $validatedData['notes'],
        ]);

        // 4. Crear los Ítems de la Factura
        foreach ($validatedData['items'] as $itemData) {
            $invoice->items()->create([
                // 'service_id' => null, // Ya no existe
                'consultation_id' => $itemData['consultation_id'],
                // 'description' => $itemData['description'],
                'quantity' => $itemData['quantity'],
                'unit_price' => $itemData['unit_price'],
                'line_total' => $itemData['line_total'],
            ]);
        }

        return redirect()->route('invoices.index')->with('success', 'Factura creada con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
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
            'items.consultation.patient' // Para los ítems, cargar la consulta y su paciente asociado
        ]);
        // También necesitamos todas las listas para los selects (pacientes, consultas)
        $patients = Patient::all();
        // Cargar consultas con su paciente para el select de ítems
        $consultations = Consultation::with('patient')->get();
        return Inertia::render('Invoices/Edit', compact('invoice', 'patients', 'consultations'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        // 1. Validar los datos (similar al store, pero con 'sometimes' para campos no siempre presentes)
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_date' => 'required|date',
            // 'due_date' => 'required|date|after_or_equal:invoice_date',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|exists:invoice_items,id', // Para identificar ítems existentes
            'items.*.consultation_id' => 'required|exists:consultations,id',
            // 'items.*.description' => 'nullable|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.line_total' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request, $invoice, $validatedData) {
            // 2. Actualizar los datos principales de la Factura
            $invoice->update([
                'patient_id' => $validatedData['patient_id'],
                'invoice_date' => $validatedData['invoice_date'],
                // 'due_date' => $validatedData['due_date'],
                'notes' => $validatedData['notes'],
                // 'invoice_number' no se actualiza, 'status' se actualiza por pagos
            ]);
            // 3. Sincronizar los Ítems de la Factura
            $existingItemIds = $invoice->items->pluck('id')->toArray();
            $updatedItemIds = [];
            foreach ($validatedData['items'] as $itemData) {
                if (isset($itemData['id']) && in_array($itemData['id'], $existingItemIds)) {
                    // Actualizar ítem existente
                    $invoice->items()->where('id', $itemData['id'])->update($itemData);
                    $updatedItemIds[] = $itemData['id'];
                } else {
                    // Crear nuevo ítem
                    $newItem = $invoice->items()->create($itemData);
                    $updatedItemIds[] = $newItem->id;
                }
            }

            // Eliminar ítems que ya no están en la lista
            $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);
            if (!empty($itemsToDelete)) {
                $invoice->items()->whereIn('id', $itemsToDelete)->delete();
            }
            // 4. Recalcular subtotal, tax_amount y total_amount después de actualizar los ítems
            $subtotal = 0;
            foreach ($invoice->items as $item) { // Recargar ítems para el cálculo
                $subtotal += $item->line_total;
            }
            // $taxRate = 0.16; // 16% de IVA
            $taxAmount = $subtotal;
            $totalAmount = $subtotal + $taxAmount;
            $invoice->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
            ]);
        });
        return redirect()->route('invoices.index')->with('success', 'Factura actualizada con éxito.');
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
        // Ahora solo necesitamos 'patient' y 'items.consultation'
        $invoice->load(['patient', 'items.consultation']);
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
