<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConsultationRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|in:programado,completado,cancelado',
            'payment_status' => 'required|in:pendiente,pagado,reembolsado,incobrable',
            'scheduled_at' => 'nullable|date',
            // 'completed_at' => 'nullable|date|after_or_equal:scheduled_at',
            'amount' => 'nullable|numeric|min:0',
            'consultation_type' => 'required|in:domiciliaria,consultorio',


            // 'payment_method_id' => 'required|integer|exists:payment_methods,id',
            // 'reference' => 'nullable|string',
            // 'paid_at' => 'required|date',
        ];
    }

    /**
     * Get the validation error messages that apply to the request.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'El campo paciente es obligatorio.',
            'patient_id.exists' => 'El paciente seleccionado no existe.',

            'user_id.required' => 'El campo tratante es obligatorio.',
            'user_id.exists' => 'El tratante seleccionado no existe.',

            'service_id.required' => 'El campo servicio es obligatorio.',
            'service_id.exists' => 'El servicio seleccionado no existe.',

            'notes.string' => 'Las notas deben ser un texto.',
            'notes.max' => 'Las notas no pueden exceder los 1000 caracteres.',

            'status.required' => 'El campo estado es obligatorio.',
            'status.in' => 'El estado debe ser uno de los siguientes: programado, completado, cancelado.',

            'payment_status.required' => 'El campo estado de pago es obligatorio.',
            'payment_status.in' => 'El estado de pago debe ser uno de los siguientes: pendiente, pagado, reembolsado, incobrable.',

            'scheduled_at.date' => 'La fecha programada debe ser una fecha válida.',

            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser menor que 0.',

            'consultation_type.required' => 'El campo tipo de consulta es obligatorio.',
            'consultation_type.in' => 'El tipo de consulta debe ser uno de los siguientes: domiciliaria, consultorio.',

            // 'payment_method_id.required' => 'El campo método de pago es obligatorio.',
            // 'payment_method_id.integer' => 'El método de pago debe ser un número entero.',
            // 'payment_method_id.exists' => 'El método de pago seleccionado no existe.',

            // 'reference.string' => 'La referencia debe ser un texto.',
        ];
    }
}
