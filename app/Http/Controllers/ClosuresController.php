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
    $fechaHoy = Carbon::today();
    $auth = Auth::user();

    // Obtener consultas del día con sus relaciones
    $consultas = Consultation::with('patient', 'user', 'subscription')
        ->whereDate('created_at', $fechaHoy)
        ->get();

    $settings = Setting::with('media')->first();

    // Calcular resúmenes
    $serviceSummary = [];
    $doctorSummary = [];
    $suscripciones = [];

    foreach ($consultas as $consulta) {
        $servicesArray = json_decode($consulta->services, true) ?? [];

        if ($consulta->patient_subscription_id && $consulta->amount == 0) {
            // Es una consulta de suscripción (funcional)
            $nombreSuscripcion = optional($consulta->subscription)->subscription->name ?? 'Suscripción sin nombre';
            $suscripciones[] = [
                'nombre' => $nombreSuscripcion,
                'consulta' => $consulta,
            ];
        } else {
            // Consulta individual
            foreach ($servicesArray as $service) {
                $name = $service['name'];
                $price = floatval($service['price']);
                if (!isset($serviceSummary[$name])) {
                    $serviceSummary[$name] = ['price' => $price, 'count' => 0, 'total' => 0];
                }
                $serviceSummary[$name]['count']++;
                $serviceSummary[$name]['total'] += $price;
            }
        }

        // Resumen por tratante
        $doctorId = $consulta->user_id;
        $doctorName = $consulta->user->name . ' ' . $consulta->user->lastname;
        $amount = $consulta->amount;
        if (!isset($doctorSummary[$doctorId])) {
            $doctorSummary[$doctorId] = ['name' => $doctorName, 'count' => 0, 'total' => 0];
        }
        $doctorSummary[$doctorId]['count']++;
        $doctorSummary[$doctorId]['total'] += $amount;
    }

    $pdf = Pdf::loadView('pdf.closurespdf', compact('consultas', 'fechaHoy', 'settings', 'auth', 'serviceSummary', 'doctorSummary'))
        ->setPaper('a4', 'landscape');

    return $pdf->stream($fechaHoy->format('d-m-Y') . '_cierre_dia.pdf', ['Attachment' => 0]);
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

        // Calcular resumen por método de pago
        $paymentMethodSummary = [];
        foreach ($pagos as $pago) {
            $methodId = $pago->payment_method_id;
            $methodName = $pago->paymentMethod->name ?? 'N/A';
            $amount = $pago->amount;
            if (!isset($paymentMethodSummary[$methodId])) {
                $paymentMethodSummary[$methodId] = ['name' => $methodName, 'count' => 0, 'total' => 0];
            }
            $paymentMethodSummary[$methodId]['count']++;
            $paymentMethodSummary[$methodId]['total'] += $amount;
        }

        // Obtener configuraciones
        $settings = Setting::with('media')->first()->get();

        // Cargar la vista del PDF
        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagosConsulta', 'pagosSuscripcion', 'fechaHoy', 'settings', 'auth', 'totalAmountConsulta', 'totalAmountSuscripcion', 'paymentMethodSummary'))
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

    $consultas = Consultation::with('patient', 'user', 'subscription')
        ->whereBetween('created_at', [$startDate, $endDate])
        ->orderBy('created_at', 'asc')
        ->get();
// dd($consultas);
    $settings = Setting::with('media')->first();

    // Calcular resúmenes
    $serviceSummary = [];
    $doctorSummary = [];
    $suscripciones = [];

    foreach ($consultas as $consulta) {
        $servicesArray = json_decode($consulta->services, true) ?? [];

        if ($consulta->patient_subscription_id && $consulta->amount == 0) {
            // Es una consulta de suscripción (funcional)
            $nombreSuscripcion = optional($consulta->subscription)->subscription->name ?? 'Suscripción sin nombre';
            $suscripciones[] = [
                'nombre' => $nombreSuscripcion,
                'consulta' => $consulta,
            ];
        } else {
            // Consulta individual
            foreach ($servicesArray as $service) {
                $name = $service['name'];
                $price = floatval($service['price']);
                if (!isset($serviceSummary[$name])) {
                    $serviceSummary[$name] = ['price' => $price, 'count' => 0, 'total' => 0];
                }
                $serviceSummary[$name]['count']++;
                $serviceSummary[$name]['total'] += $price;
            }
        }

        // Resumen por tratante
        $doctorId = $consulta->user_id;
        $doctorName = $consulta->user->name . ' ' . $consulta->user->lastname;
        $amount = $consulta->amount;
        if (!isset($doctorSummary[$doctorId])) {
            $doctorSummary[$doctorId] = ['name' => $doctorName, 'count' => 0, 'total' => 0];
        }
        $doctorSummary[$doctorId]['count']++;
        $doctorSummary[$doctorId]['total'] += $amount;
    }

    $pdf = Pdf::loadView('pdf.closurespdf', compact('consultas', 'startDate', 'endDate', 'settings', 'auth', 'fechaHoy', 'serviceSummary', 'doctorSummary'))
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

        // Calcular resumen por método de pago
        $paymentMethodSummary = [];
        foreach ($pagos as $pago) {
            $methodId = $pago->payment_method_id;
            $methodName = $pago->paymentMethod->name ?? 'N/A';
            $amount = $pago->amount;
            if (!isset($paymentMethodSummary[$methodId])) {
                $paymentMethodSummary[$methodId] = ['name' => $methodName, 'count' => 0, 'total' => 0];
            }
            $paymentMethodSummary[$methodId]['count']++;
            $paymentMethodSummary[$methodId]['total'] += $amount;
        }

        $settings = Setting::with('media')->first()->get();

        $pdf = Pdf::loadView('pdf.closurespaymentspdf', compact('pagosConsulta', 'pagosSuscripcion', 'startDate', 'endDate', 'settings', 'auth', 'totalAmountConsulta', 'totalAmountSuscripcion', 'fechaHoy', 'paymentMethodSummary'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream($startDate . '_to_' . $endDate . '_pagos_rango.pdf', ['Attachment' => 0]);
    }
}
