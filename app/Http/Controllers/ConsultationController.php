<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Models\Patient;
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
        $patients = Patient::all();
        $users = User::all();
        $services = Service::all(); // Assuming you have a Service model
        return Inertia::render('Consultations/Create', compact('patients', 'users', 'services'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsultationRequest $request)
{
    // Crear la consulta sin el campo service_id
    $validatedData = $request->validated();
    unset($validatedData['service_id']); // Eliminar service_id del array de datos

    // Crear la consulta
    $consultation = Consultation::create($validatedData);

    // Asociar los servicios seleccionados
    if (is_array($request->service_id)) {
        $consultation->services()->attach($request->service_id);
    } else {
        // Si solo hay un servicio, puedes usar attach directamente
        $consultation->services()->attach($request->service_id);
    }
    
    return redirect()->route('consultations.index');
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
        $consultation->load('services','patient','user'); // Cargar los servicios relacionados
        $patients = Patient::all();
        $users = User::all();
        $services = Service::all();

        return Inertia::render('Consultations/Edit', compact('consultation', 'patients', 'users', 'services'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConsultationRequest $request, Consultation $consultation)
{
    // Extraer los datos validados, excluyendo service_id
    $data = $request->validated();
    unset($data['service_id']); // Eliminar service_id de los datos que se van a actualizar

    // Actualizar la consulta con los datos validados
    $consultation->update($data);

    // Sincronizar los servicios
    $consultation->services()->sync($request->input('service_id'));

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
