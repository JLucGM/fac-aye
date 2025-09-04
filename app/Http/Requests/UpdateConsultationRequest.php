<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConsultationRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'patient_id' => 'required|exists:patients,id',
            'service_id' => [
                'array',
                Rule::exists('services', 'id'),
                Rule::requiredIf(function () {
                    return $this->input('subscription_use') !== 'yes';
                }),
            ],
            'service_id.*' => 'exists:services,id',
            'status' => 'required|in:programado,completado,cancelado',
            'scheduled_at' => 'nullable|date',
            'notes' => 'nullable|string|max:1000',
            'amount' => 'nullable|numeric|min:0',
            'consultation_type' => 'required|in:domiciliaria,consultorio',
            'payment_status' => 'required|in:pendiente,pagado,reembolsado,incobrable',
            'subscription_use' => 'required|string|in:yes,no',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'El campo tratante es obligatorio.',
            'user_id.exists' => 'El tratante seleccionado no existe.',
            'patient_id.required' => 'El campo paciente es obligatorio.',
            'patient_id.exists' => 'El paciente seleccionado no existe.',
            'service_id.required' => 'El campo servicio es obligatorio.',
            'service_id.array' => 'El campo servicio debe ser un array.',
            'service_id.*.exists' => 'Uno o más servicios seleccionados no existen.',
            'status.required' => 'El campo estado es obligatorio.',
            'status.in' => 'El estado debe ser uno de los siguientes: programado, completado, cancelado.',
            'notes.string' => 'Las notas deben ser un texto.',
            'notes.max' => 'Las notas no pueden exceder los 1000 caracteres.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser menor que 0.',
            'consultation_type.required' => 'El campo tipo de consulta es obligatorio.',
            'consultation_type.in' => 'El tipo de consulta debe ser uno de los siguientes: domiciliaria, consultorio.',
            'payment_status.required' => 'El campo estado de pago es obligatorio.',
            'payment_status.in' => 'El estado de pago debe ser uno de los siguientes: pendiente, pagado, reembolsado, incobrable.',
        ];
    }
}
