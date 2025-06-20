<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClosuresController extends Controller
{
    public function cierreDelDia(Request $request)
    {
        // Obtener la fecha actual
        $fechaHoy = Carbon::today();
        // Obtener todas las consultas del día
        $consultas = Consultation::with('patient', 'services', 'user')->whereDate('created_at', $fechaHoy)->get();
        // return $consultas;
        // Cargar la vista del PDF
        $pdf = Pdf::loadView('pdf.closurespdf', compact('consultas', 'fechaHoy'))->setPaper('a4', 'landscape');
        // // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream('cierre_dia.pdf', ['Attachment' => 0]); // Cambia el Attachment a 0
    }

    public function pagosDelDia()
    {
        // Obtener la fecha actual
        $fechaHoy = Carbon::today();
        // Obtener todas las consultas del día
        $pagos = Payment::with('paymentMethod','consultations.patient')->whereDate('created_at', $fechaHoy)->get();
        // return $pagos;
        // Cargar la vista del PDF
        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagos','fechaHoy'))->setPaper('a4', 'landscape');
        // // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream('cierre_dia.pdf', ['Attachment' => 0]); // Cambia el Attachment a 0
    }
}
