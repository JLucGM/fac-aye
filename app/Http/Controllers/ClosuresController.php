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
        $consultas = Consultation::with('patient', 'user', 'subscription')->whereDate('created_at', $fechaHoy)->get();
        $settings = Setting::with('media')->first()->get();
        // return $auth;
        // dd($consultas);
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

        // Obtener todos los pagos del día
        $pagos = Payment::with('paymentMethod', 'consultations.patient', 'patientSubscriptions.subscription', 'patientSubscriptions.patient')
            ->whereDate('created_at', $fechaHoy)
            ->get();

        // Filtrar pagos de consulta y de suscripción
        $pagosConsulta = $pagos->filter(function ($pago) {
            return $pago->consultations->isNotEmpty();
        });
        $pagosSuscripcion = $pagos->filter(function ($pago) {
            return $pago->patientSubscriptions->isNotEmpty();
        });
// dd($pagosSuscripcion);
        // Calcular totales
        $totalAmountConsulta = $pagosConsulta->sum('amount');
        $totalAmountSuscripcion = $pagosSuscripcion->sum('amount');

        // Obtener configuraciones
        $settings = Setting::with('media')->first()->get();

        // Cargar la vista del PDF
        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagosConsulta', 'pagosSuscripcion', 'fechaHoy', 'settings', 'auth', 'totalAmountConsulta', 'totalAmountSuscripcion'))
            ->setPaper('a4', 'landscape');

        // Devolver el PDF para abrir en una nueva pestaña
        return $pdf->stream($fechaHoy->format('d-m-Y') . '_pagos_dia.pdf', ['Attachment' => 0]); // Cambia el Attachment a 0
    }

    public function consultationpdf(Consultation $consultation)
    {
        // Obtener la fecha actual
        $fechaHoy = Carbon::today();
        $auth = Auth::user();

        // Obtener la consulta específica
        $consultation = Consultation::with('patient.subscriptions.subscription')->findOrFail($consultation->id);
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

        // Ajustar endDate para incluir todo el día
        $endDate = Carbon::parse($endDate)->endOfDay();

        $consultas = Consultation::with('patient', 'user')
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

        $endDate = Carbon::parse($endDate)->endOfDay();

        $pagos = Payment::with('paymentMethod', 'consultations.patient', 'patientSubscriptions.subscription', 'patientSubscriptions.patient')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'asc')
            ->get();

        // Filtrar pagos de consulta y de suscripción
        $pagosConsulta = $pagos->filter(function ($pago) {
            return $pago->consultations->isNotEmpty();
        });
        $pagosSuscripcion = $pagos->filter(function ($pago) {
            return $pago->patientSubscriptions->isNotEmpty();
        });
        // dd($pagosConsulta);

        $totalAmountConsulta = $pagosConsulta->sum('amount');
        $totalAmountSuscripcion = $pagosSuscripcion->sum('amount');

        $settings = Setting::with('media')->first()->get();

        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagosConsulta', 'pagosSuscripcion', 'startDate', 'endDate', 'settings', 'auth', 'totalAmountConsulta', 'totalAmountSuscripcion', 'fechaHoy'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream($startDate . '_to_' . $endDate . '_pagos_rango.pdf', ['Attachment' => 0]);
    }
}
