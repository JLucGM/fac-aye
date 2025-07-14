<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClosuresController extends Controller
{
    public function cierreDelDia(Request $request)
    {
        // Obtener la fecha actual
        $fechaHoy = Carbon::today();
        $auth = Auth::user();

        // Obtener todas las consultas del día
        $consultas = Consultation::with('patient', 'services', 'user')->whereDate('created_at', $fechaHoy)->get();
        $settings = Setting::with('media')->first()->get();
        // return $auth;
        // Cargar la vista del PDF
        $pdf = Pdf::loadView('pdf.closurespdf', compact('consultas', 'fechaHoy', 'settings', 'auth'))->setPaper('a4', 'landscape');
        // // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream($fechaHoy->format('d-m-Y') . '_cierre_dia.pdf', ['Attachment' => 0]); // Cambia el Attachment a 0
    }

    public function pagosDelDia()
    {
        // Obtener la fecha actual
        $fechaHoy = Carbon::today();
        $auth = Auth::user();

        // Obtener todas las consultas del día
        $pagos = Payment::with('paymentMethod', 'consultations.patient')->whereDate('created_at', $fechaHoy)->get();
        $settings = Setting::with('media')->first()->get();

        $totalAmount = $pagos->sum('amount'); // Calcula la suma total de los montos

        // return $pagos;
        // Cargar la vista del PDF
        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagos', 'fechaHoy', 'settings', 'auth', 'totalAmount'))->setPaper('a4', 'landscape');
        // // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream($fechaHoy->format('d-m-Y') . '_pagos_dia.pdf', ['Attachment' => 0]); // Cambia el Attachment a 0
    }

    public function consultationpdf(Consultation $consultation)
    {
        // Obtener la fecha actual
        $fechaHoy = Carbon::today();
        $auth = Auth::user();

        // Obtener la consulta específica
        $consultation = Consultation::with('patient.subscriptions')->findOrFail($consultation->id);
        $settings = Setting::with('media')->first()->get();
        // return $consultas;
        // Cargar la vista del PDF
        // dd($consultation);
        $pdf = Pdf::loadView('pdf.assistspdf', compact('consultation', 'fechaHoy', 'settings', 'auth'))->setPaper('a4');

        // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream('comprobante_asistencia.pdf', ['Attachment' => 0]); // Cambia el Attachment a 0
    }

    public function cierrePorRango(Request $request)
    {
        $startDate = $request->input('start');
        $endDate = $request->input('end');
        $auth = Auth::user();
        $fechaHoy = Carbon::today();

        $consultas = Consultation::with('patient', 'services', 'user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('scheduled_at', 'asc') // Ordenar por fecha de creación
            ->get();

        $settings = Setting::with('media')->first()->get();

        $pdf = Pdf::loadView('pdf.closurespdf', compact('consultas', 'startDate', 'endDate', 'settings', 'auth', 'fechaHoy'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream($startDate . '_to_' . $endDate . '_cierre_rango.pdf', ['Attachment' => 0]);
    }


    public function pagosPorRango(Request $request)
    {
        $startDate = $request->input('start');
        $endDate = $request->input('end');
        $auth = Auth::user();
        $fechaHoy = Carbon::today();

        $pagos = Payment::with('paymentMethod', 'consultations.patient')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'asc') // Ordenar por fecha de creación
            ->get();

        $settings = Setting::with('media')->first()->get();
        $totalAmount = $pagos->sum('amount');

        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagos', 'startDate', 'endDate', 'settings', 'auth', 'totalAmount', 'fechaHoy'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream($startDate . '_to_' . $endDate . '_pagos_rango.pdf', ['Attachment' => 0]);
    }
}
