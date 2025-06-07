<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\UpdateConsultationRequest;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Inertia\Inertia;

class ConsultationController extends Controller
{
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
        Consultation::create($request->validated());
        
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
        $consultation->update($request->validated());
        return redirect()->route('consultations.index');
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
