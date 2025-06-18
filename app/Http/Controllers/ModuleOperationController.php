<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleOperationController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('can:admin.consultation.index')->only('index');
    //     $this->middleware('can:admin.consultation.create')->only('create', 'store');
    //     $this->middleware('can:admin.consultation.edit')->only('edit', 'update');
    //     $this->middleware('can:admin.consultation.delete')->only('delete');
    // }

    public function index()
    {
        return Inertia::render('ModuleOperation/Index');
    }

    public function first_visit_index()
    {
        $users = User::all();
        $services = Service::all();
        $paymentMethods = PaymentMethod::where('active', 1)->get();

        return Inertia::render('ModuleOperation/FirstVisit', compact('users', 'services', 'paymentMethods'));
    }

    public function first_visit_store(Request $request)
    {
        // Validar los datos recibidos
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'birthdate' => 'required|date',
            'identification' => 'required|string|max:20',
            'user_id' => 'required|integer|exists:users,id',
            'service_id' => 'required|array',
            'status' => 'required|string',
            'scheduled_at' => 'required|date',
            'consultation_type' => 'required|string',
            'notes' => 'nullable|string',
            'payment_status' => 'required|string',
            'amount' => 'required|numeric',
            'payment_method_id' => 'required|integer|exists:payment_methods,id',
            'reference' => 'nullable|string',
            'paid_at' => 'required|date',
        ]);

        // Crear o encontrar el paciente
        $patient = Patient::firstOrCreate(
            ['identification' => $validatedData['identification']],
            [
                'name' => $validatedData['name'],
                'lastname' => $validatedData['lastname'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'birthdate' => $validatedData['birthdate'],
            ]
        );

        // Crear la consulta
        $consultation = Consultation::create([
            'user_id' => $validatedData['user_id'],
            'patient_id' => $patient->id, // Asocia la consulta con el paciente creado
            'status' => $validatedData['status'],
            'scheduled_at' => $validatedData['scheduled_at'],
            'consultation_type' => $validatedData['consultation_type'],
            'notes' => $validatedData['notes'],
            'payment_status' => $validatedData['payment_status'],
            'amount' => $validatedData['amount'],
        ]);

        // Asociar los servicios seleccionados
        if (is_array($request->service_id)) {
            $consultation->services()->attach($request->service_id);
        } else {
            // Si solo hay un servicio, puedes usar attach directamente
            $consultation->services()->attach($request->service_id);
        }

        // Crear el pago sin el campo consultation_id
        $payment = Payment::create([
            'payment_method_id' => $validatedData['payment_method_id'],
            'amount' => $validatedData['amount'],
            'status' => $validatedData['payment_status'],
            'reference' => $validatedData['reference'],
            'paid_at' => $validatedData['paid_at'],
            // No se incluye consultation_id
        ]);

        // $payment->consultations()->attach($consultation->id);

        $payment->consultations()->sync($consultation->id);

        //     // Actualizar el estado de las consultas
        //     foreach ($request->consultation_ids as $consultationId) {
        //         $consultation = Consultation::find($consultationId);
        //         if ($consultation) {
        //             $consultation->update(['payment_status' => 'paid']);
        //         }
        //     }

        // Redirigir o renderizar la vista después de crear los registros
        return Inertia::render('ModuleOperation/Index');
    }

    public function profile_patient_index()
    {
        $patients = Patient::with('consultations')->get();

        return Inertia::render('ModuleOperation/ProfilePatient', compact('patients'));
    }

    


}
