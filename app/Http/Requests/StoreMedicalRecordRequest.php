<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'consultation_id' => 'required|exists:consultations,id',
            'title' => 'required|string|max:255',
            'anamnesis' => 'nullable|string|max:1000',
            'pain_behavior' => 'nullable|string|max:1000',
            'description' => 'nullable|string|max:1000',
            // 'record_date' => 'nullable|date',
            'type' => 'required|in:consulta,diagnostico,tratamiento,otro',
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'El campo paciente es obligatorio.',
            'patient_id.exists' => 'El paciente seleccionado no existe.',
            'consultation_id.required' => 'El campo consulta es obligatorio.',
            'consultation_id.exists' => 'La consulta seleccionada no existe.',
            'title.required' => 'El campo título es obligatorio.',
            'title.string' => 'El campo título debe ser una cadena de texto.',
            'title.max' => 'El campo título no debe exceder los 255 caracteres.',
            'anamnesis.string' => 'El campo anamnesis debe ser una cadena de texto.',
            'anamnesis.max' => 'El campo anamnesis no debe exceder los 1000 caracteres.',
            'pain_behavior.string' => 'El campo comportamiento del dolor debe ser una cadena de texto.',
            'pain_behavior.max' => 'El campo comportamiento del dolor no debe exceder los 1000 caracteres.',
            'description.string' => 'El campo descripción debe ser una cadena de texto.',
            'description.max' => 'El campo descripción no debe exceder los 1000 caracteres.',
            // 'record_date.date' => 'El campo fecha del registro debe ser una fecha válida.',
            'type.required' => 'El campo tipo es obligatorio.',
            'type.in' => 'El campo tipo debe ser uno de los siguientes valores: consulta, diagnóstico, tratamiento, otro.',
        ];
    }
}
