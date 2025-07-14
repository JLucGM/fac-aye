<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Service;
use App\Models\Subscription;
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
        $doctors = Doctor::all();
        $subscriptions = Subscription::all();

        return Inertia::render('ModuleOperation/FirstVisit', compact('users', 'services', 'paymentMethods', 'doctors', 'subscriptions'));
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
            'address' => 'nullable|string|max:255',
            'doctor_id' => 'nullable|integer|exists:doctors,id', // Asegúrate de que el doctor sea opcional
            'subscription_id' => 'nullable|integer|exists:subscriptions,id', // Validar la suscripción si se proporciona
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
                'address' => $validatedData['address'] ?? null,
                'doctor_id' => $validatedData['doctor_id'] ?? null, // Asocia el doctor si se proporciona
            ]
        );

        // Inicializar patient_subscription_id
        $patientSubscriptionId = null;
        $totalAmount = 0; // Inicializa el monto total

        // Si viene subscription_id, manejamos la suscripción
        if ($request->filled('subscription_id')) {
            $subscription = Subscription::findOrFail($request->subscription_id);

            // Buscar si ya tiene una suscripción ACTIVA del mismo tipo
            $activeSubscription = $patient->subscriptions()
                ->where('subscription_id', $subscription->id)
                ->where('status', 'active')
                ->first();

            if ($activeSubscription) {
                // Si existe: consumir 1 consulta
                $activeSubscription->update([
                    'consultations_used' => $activeSubscription->consultations_used + 1,
                    'consultations_remaining' => $activeSubscription->consultations_remaining - 1,
                    'status' => ($activeSubscription->consultations_remaining - 1) > 0 ? 'active' : 'inactive'
                ]);

                // Asignar el ID de la suscripción activa a la consulta
                $patientSubscriptionId = $activeSubscription->id;

                // Establecer el monto total en 0
                $totalAmount = 0;
            } else {
                // Si no existe: crear nueva suscripción consumiendo 1 consulta
                $newSubscription = $patient->subscriptions()->create([
                    'subscription_id' => $subscription->id,
                    'start_date' => now(),
                    'end_date' => $this->calculateEndDate($subscription->type),
                    'consultations_used' => 1, // Consume 1 consulta inmediatamente
                    'consultations_remaining' => $subscription->consultations_allowed - 1, // Total permitido menos 1
                    'status' => ($subscription->consultations_allowed - 1) > 0 ? 'active' : 'inactive'
                ]);

                // Asignar el ID de la nueva suscripción a la consulta
                $patientSubscriptionId = $newSubscription->id;

                // Establecer el monto total en 0
                $totalAmount = 0;
            }
        } else {
            // Si no hay suscripción, calcular el monto total basado en los servicios seleccionados
            $totalAmount = 0; // Inicializa el monto total
            if (is_array($request->service_id)) {
                foreach ($request->service_id as $serviceId) {
                    $service = Service::find($serviceId);
                    if ($service) {
                        $totalAmount += $service->price; // Sumar el precio del servicio
                    }
                }
            }
        }

        // Crear la consulta
        $consultation = Consultation::create([
            'user_id' => $validatedData['user_id'],
            'patient_id' => $patient->id, // Asocia la consulta con el paciente creado
            'status' => $validatedData['status'],
            'scheduled_at' => $validatedData['scheduled_at'],
            'consultation_type' => $validatedData['consultation_type'],
            'notes' => $validatedData['notes'],
            'payment_status' => $validatedData['payment_status'],
            'amount' => $totalAmount, // Establecer el monto total
            'patient_subscription_id' => $patientSubscriptionId, // Asigna el ID de la suscripción
        ]);

        // Obtener los servicios seleccionados
        $servicesData = [];
        if (is_array($request->service_id)) {
            foreach ($request->service_id as $serviceId) {
                $service = Service::find($serviceId);
                if ($service) {
                    $servicesData[] = [
                        'id' => $service->id,
                        'name' => $service->name,
                        'price' => $totalAmount === 0 ? 0 : $service->price, // Establecer el precio a 0 si el total es 0
                    ];
                }
            }
        }

        // Almacenar la información de los servicios en el campo 'services'
        $consultation->services = json_encode($servicesData);
        $consultation->save();

        // Redirigir o renderizar la vista después de crear los registros
        return redirect()->route('consultations.edit', $consultation->id);
    }


    public function profile_patient_index()
    {
        $patients = Patient::with('consultations')->get();

        return Inertia::render('ModuleOperation/ProfilePatient', compact('patients'));
    }

    // Método auxiliar para calcular la fecha de fin
    protected function calculateEndDate(string $subscriptionType): \DateTime
    {
        return match ($subscriptionType) {
            'semanal' => now()->addWeek(),
            'mensual' => now()->addMonth(),
            'anual' => now()->addYear(),
            default => now()->addMonth(), // Valor por defecto
        };
    }
}
