<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Service;
use App\Models\User;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.consultation.index')->only('index');
        $this->middleware('can:admin.consultation.create')->only('create', 'store');
        $this->middleware('can:admin.consultation.edit')->only('edit', 'update');
        $this->middleware('can:admin.consultation.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $consultations = Consultation::with(['patient', 'user'])->get();
        return Inertia::render('Consultations/Index', compact('consultations'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $patients = Patient::with('subscriptions')->get();
        $users = User::all();
        $services = Service::all(); // Assuming you have a Service model
        $paymentMethods = PaymentMethod::where('active', 1)->get();

        return Inertia::render('Consultations/Create', compact('patients', 'users', 'services', 'paymentMethods'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsultationRequest $request)
    {
        // Validar los datos de la consulta
        $validatedData = $request->validated();
        unset($validatedData['service_id']); // Eliminar service_id del array de datos

        // Buscar el paciente
        $patient = Patient::find($validatedData['patient_id']); // Asegúrate de que el patient_id esté en los datos validados

        // Buscar suscripción activa del paciente (si existe)
        $activeSubscription = $patient->subscriptions()
            ->where('status', 'active')
            ->first();

        // Si existe suscripción activa, actualizarla
        if ($activeSubscription) {
            // Incrementar consultas usadas
            $activeSubscription->consultations_used += 1;
            // Decrementar consultas restantes
            $activeSubscription->consultations_remaining -= 1;
            // Actualizar la suscripción
            $activeSubscription->save();

            // Marcar como inactiva si no quedan consultas
            if ($activeSubscription->consultations_remaining <= 0) {
                $activeSubscription->update(['status' => 'inactive']);
            }

            // Asignar el ID de la suscripción activa a la consulta
            $validatedData['patient_subscription_id'] = $activeSubscription->id;
        }

        // Crear la consulta
        $consultation = Consultation::create($validatedData);

        // Obtener los servicios seleccionados
        $servicesData = [];
        if (is_array($request->service_id)) {
            foreach ($request->service_id as $serviceId) {
                $service = Service::find($serviceId);
                if ($service) {
                    // Si el paciente tiene una suscripción activa, establecer el precio a 0
                    $price = $activeSubscription ? 0 : $service->price;
                    $servicesData[] = [
                        'id' => $service->id,
                        'name' => $service->name,
                        'price' => $price,
                    ];
                }
            }
        } else {
            // Si solo hay un servicio, puedes usar attach directamente
            $service = Service::find($request->service_id);
            if ($service) {
                // Si el paciente tiene una suscripción activa, establecer el precio a 0
                $price = $activeSubscription ? 0 : $service->price;
                $servicesData[] = [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => $price,
                ];
            }
        }

        // Almacenar la información de los servicios en el campo 'services'
        $consultation->services = json_encode($servicesData);
        $consultation->save();

        return redirect()->route('consultations.edit', $consultation->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(Consultation $consultation)
    {
        return Inertia::render('Consultations/Show', compact('consultation'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consultation $consultation)
{
    // Cargar los datos relacionados, incluyendo las suscripciones del paciente
    $consultation->load('patient.subscriptions', 'user', 'payment','medicalRecords'); // Cargar las suscripciones del paciente
    $consultation->services = json_decode($consultation->services, true); // Decodificar el JSON a un array
    $patients = Patient::all();
    $users = User::all();
    $services = Service::all();
// dd($consultation);
    return Inertia::render('Consultations/Edit', compact('consultation', 'patients', 'users', 'services'));
}


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConsultationRequest $request, Consultation $consultation)
    {
        // Extraer los datos validados
        $data = $request->validated();

        // Actualizar la consulta con los datos validados
        $consultation->update($data);

        // Obtener los servicios seleccionados
        $servicesData = [];
        if (is_array($request->service_id)) {
            foreach ($request->service_id as $serviceId) {
                $service = Service::find($serviceId);
                if ($service) {
                    $servicesData[] = [
                        'id' => $service->id,
                        'name' => $service->name,
                        'price' => $service->price,
                    ];
                }
            }
        } else {
            // Si solo hay un servicio, puedes usar attach directamente
            $service = Service::find($request->service_id);
            if ($service) {
                $servicesData[] = [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => $service->price,
                ];
            }
        }

        // Almacenar la información de los servicios en el campo 'services'
        $consultation->services = json_encode($servicesData);
        $consultation->save();

        // Redirigir a la lista de consultas con un mensaje de éxito
        return redirect()->route('consultations.index')->with('success', 'Consulta actualizada con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Consultation $consultation)
    {
        $consultation->delete();
        return redirect()->route('consultations.index');
    }
}
