<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\PatientBalanceTransaction;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $useSubscription = ($validatedData['subscription_use'] ?? 'no') === 'yes';

        try {
            $consultation = DB::transaction(function () use ($validatedData, $useSubscription) {
                // Crear o encontrar paciente
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

                // Variable para guardar la suscripción del paciente que se usará (si corresponde)
                $patientSubscription = null;

                // Si se proporcionó subscription_id (asignar nueva suscripción)
                if (!empty($validatedData['subscription_id'])) {
                    // Verificar si el paciente ya tiene alguna suscripción activa
                    if ($patient->subscriptions()->where('status', 'active')->exists()) {
                        throw new \Exception('El paciente ya tiene una suscripción activa. No puede adquirir una nueva hasta que la actual se agote.');
                    }

                    $subscription = Subscription::findOrFail($validatedData['subscription_id']);

                    // Crear nueva suscripción
                    $patientSubscription = $patient->subscriptions()->create([
                        'subscription_id' => $subscription->id,
                        'start_date' => now(),
                        'end_date' => $this->calculateEndDate($subscription->type),
                        'consultations_used' => 0,
                        'consultations_remaining' => $subscription->consultations_allowed,
                        'status' => 'active',
                    ]);

                    // Registrar movimiento financiero por la suscripción
                    PatientBalanceTransaction::create([
                        'patient_id' => $patient->id,
                        'patient_subscription_id' => $patientSubscription->id,
                        'amount' => -$subscription->price,
                        'type' => 'funcional_deuda',
                        'description' => "Deuda por suscripción #{$patientSubscription->id}",
                    ]);

                    // Actualizar balance del paciente
                    $patient->balance = ($patient->balance ?? 0) - $subscription->price;
                    $patient->save();
                }

                // Si se quiere usar suscripción en la consulta, obtener la activa
                if ($useSubscription) {
                    // Buscar la suscripción activa del paciente (puede ser la recién creada o una existente)
                    $activeSubscription = $patient->subscriptions()->where('status', 'active')->first();
                    if (!$activeSubscription) {
                        throw new \Exception('El paciente no tiene una suscripción activa para usar en la consulta.');
                    }
                    $patientSubscription = $activeSubscription;
                }

                // Preparar servicios y monto para la consulta
                $servicesData = collect();
                $totalAmount = 0;
                $paymentStatus = $validatedData['payment_status'] ?? 'pendiente';

                if ($useSubscription && $patientSubscription) {
                    // Consumir 1 consulta de la suscripción
                    $patientSubscription->increment('consultations_used');
                    $patientSubscription->decrement('consultations_remaining');

                    if ($patientSubscription->consultations_remaining <= 0) {
                        $patientSubscription->update(['status' => 'inactive']);
                    }

                    $servicesData = collect([[
                        'id' => null,
                        'name' => $patientSubscription->subscription->name,
                        'price' => 0,
                    ]]);

                    $totalAmount = 0;
                    $paymentStatus = 'pagado';
                } else {
                    // No usa suscripción, servicios normales
                    if (is_array($validatedData['service_id'])) {
                        $services = Service::whereIn('id', $validatedData['service_id'])->get();
                        foreach ($services as $service) {
                            $servicesData->push([
                                'id' => $service->id,
                                'name' => $service->name,
                                'price' => $service->price,
                            ]);
                            $totalAmount += $service->price;
                        }
                    }
                    $paymentStatus = 'pendiente';
                }

                // Crear la consulta
                $consultation = Consultation::create([
                    'user_id' => $validatedData['user_id'],
                    'patient_id' => $patient->id,
                    'status' => $validatedData['status'],
                    'scheduled_at' => $validatedData['scheduled_at'] ?? null,
                    'consultation_type' => $validatedData['consultation_type'],
                    'notes' => $validatedData['notes'] ?? null,
                    'payment_status' => $paymentStatus,
                    'amount' => $totalAmount,
                    'patient_subscription_id' => $patientSubscription->id ?? null,
                ]);

                // Guardar servicios como JSON
                $consultation->services = $servicesData->toJson();
                $consultation->save();

                // Ajustar balance y registrar movimiento si no usa suscripción y hay monto
                if (!$useSubscription && $totalAmount > 0) {
                    $patient->balance = ($patient->balance ?? 0) - $totalAmount;
                    $patient->save();

                    PatientBalanceTransaction::create([
                        'patient_id' => $patient->id,
                        'consultation_id' => $consultation->id,
                        'amount' => -$totalAmount,
                        'type' => 'consulta_deuda',
                        'description' => "Deuda por consulta #{$consultation->id}",
                    ]);
                }

                return $consultation;
            });
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        if (!$consultation) {
            return back()->withErrors(['error' => 'No se pudo crear la consulta.']);
        }

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
