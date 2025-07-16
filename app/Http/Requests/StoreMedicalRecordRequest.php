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
}
