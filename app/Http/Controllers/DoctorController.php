<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.doctor.index')->only('index');
        $this->middleware('can:admin.doctor.create')->only('create', 'store');
        $this->middleware('can:admin.doctor.edit')->only('edit', 'update');
        $this->middleware('can:admin.doctor.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $doctors = Doctor::all();
        return Inertia::render('Doctors/Index', compact('doctors'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Doctors/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:doctors,email',
            'phone' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:255',
            'identification' => 'nullable|string|max:50',
        ]);

        Doctor::create($request->all());

        return redirect()->route('doctors.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        return Inertia::render('Doctors/Show', compact('doctor'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        $doctor->load('patients'); // Load related patients if needed
        // dd($doctor);
        return Inertia::render('Doctors/Edit', compact('doctor'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:doctors,email,' . $doctor->id,
            'phone' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:255',
            'identification' => 'nullable|string|max:50',
        ]);

        $doctor->update($request->all());

        return redirect()->route('doctors.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return redirect()->route('doctors.index');
    }
}
