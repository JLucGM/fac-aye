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
use Illuminate\Validation\Rule;
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
            'service_id' => [
                'array',
                Rule::exists('services', 'id'),
                Rule::requiredIf(function () use ($request) {
                    return ($request->input('subscription_use') ?? 'no') !== 'yes';
                }),
            ],
            'status' => 'required|string',
            'scheduled_at' => 'nullable|date',
            'consultation_type' => 'required|string',
            'notes' => 'nullable|string',
            'payment_status' => 'required|string',
            'amount' => 'required|numeric',
            'address' => 'nullable|string|max:255',
            'doctor_id' => 'nullable|integer|exists:doctors,id',
            'subscription_id' => 'nullable|integer|exists:subscriptions,id',
            'subscription_use' => 'nullable|string|in:yes,no',
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
                'doctor_id' => $validatedData['doctor_id'] ?? null,
            ]
        );

        $patientSubscriptionId = null;
        $servicesData = collect();
        $totalAmount = 0;

        if (($validatedData['subscription_use'] ?? 'no') === 'yes' && !empty($validatedData['subscription_id'])) {
            $subscription = Subscription::findOrFail($validatedData['subscription_id']);

            // Buscar suscripción activa del paciente del mismo tipo
            $activeSubscription = $patient->subscriptions()
                ->where('subscription_id', $subscription->id)
                ->where('status', 'active')
                ->first();

            if ($activeSubscription) {
                // Consumir 1 consulta
                $activeSubscription->increment('consultations_used');
                $activeSubscription->decrement('consultations_remaining');

                if ($activeSubscription->consultations_remaining <= 0) {
                    $activeSubscription->update(['status' => 'inactive']);
                }

                $patientSubscriptionId = $activeSubscription->id;

                // Servicios: solo la suscripción con precio 0
                $servicesData = collect([[
                    'id' => null,
                    'name' => $activeSubscription->subscription->name,
                    'price' => 0,
                ]]);

                $totalAmount = 0;
            } else {
                // Crear nueva suscripción consumiendo 1 consulta
                $newSubscription = $patient->subscriptions()->create([
                    'subscription_id' => $subscription->id,
                    'start_date' => now(),
                    'end_date' => $this->calculateEndDate($subscription->type),
                    'consultations_used' => 1,
                    'consultations_remaining' => $subscription->consultations_allowed - 1,
                    'status' => ($subscription->consultations_allowed - 1) > 0 ? 'active' : 'inactive',
                ]);

                $patientSubscriptionId = $newSubscription->id;

                $servicesData = collect([[
                    'id' => null,
                    'name' => $subscription->name,
                    'price' => 0,
                ]]);

                $totalAmount = 0;
            }
        } else {
            // No usa suscripción, servicios normales
            if (is_array($validatedData['service_id'])) {
                foreach ($validatedData['service_id'] as $serviceId) {
                    $service = Service::find($serviceId);
                    if ($service) {
                        $servicesData->push([
                            'id' => $service->id,
                            'name' => $service->name,
                            'price' => $service->price,
                        ]);
                        $totalAmount += $service->price;
                    }
                }
            }
        }

        // Crear la consulta
        $consultation = Consultation::create([
            'user_id' => $validatedData['user_id'],
            'patient_id' => $patient->id,
            'status' => $validatedData['status'],
            'scheduled_at' => $validatedData['scheduled_at'] ?? null,
            'consultation_type' => $validatedData['consultation_type'],
            'notes' => $validatedData['notes'] ?? null,
            'payment_status' => $validatedData['payment_status'],
            'amount' => $totalAmount,
            'patient_subscription_id' => $patientSubscriptionId,
        ]);

        // Guardar servicios como JSON
        $consultation->services = $servicesData->toJson();
        $consultation->save();

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
