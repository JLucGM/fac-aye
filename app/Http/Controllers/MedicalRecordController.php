<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMedicalRecordRequest;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function store(StoreMedicalRecordRequest $request)
    {
        // dd($request->all());
        $validatedData = $request->validated();
        $medicalRecord = MedicalRecord::create($validatedData);

        return redirect()->route('consultations.edit', $validatedData['consultation_id'])
            ->with('success', 'Registro médico creado exitosamente.');
    }

    public function update(StoreMedicalRecordRequest $request, $id)
    {
        // Buscar el registro médico por ID
        $medicalRecord = MedicalRecord::findOrFail($id);
        // Validar los datos de la solicitud
        $validatedData = $request->validated();
        // Actualizar el registro médico
        $medicalRecord->update($validatedData);
        return redirect()->route('consultations.edit', $validatedData['consultation_id'])
            ->with('success', 'Registro médico actualizado exitosamente.');
    }
}
