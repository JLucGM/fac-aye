<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            // 'service_id' => 'required|exists:services,id',
            'status' => 'required|in:scheduled,completed,cancelled',
            'scheduled_at' => 'nullable|date',
            // 'completed_at' => 'nullable|date_format:Y-m-d H:i:s',
            'notes' => 'nullable|string|max:1000',
            // 'payment_status' => 'required|in:pending,paid,refunded',
            'amount' => 'nullable|numeric|min:0',
            'consultation_type' => 'required|in:domiciliary,office',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'El campo tratante es obligatorio.',
            'user_id.exists' => 'El tratante seleccionado no existe.',

            'patient_id.required' => 'El campo paciente es obligatorio.',
            'patient_id.exists' => 'El paciente seleccionado no existe.',

            // 'service_id.required' => 'El campo servicio es obligatorio.',
            // 'service_id.exists' => 'El servicio seleccionado no existe.',

            'status.required' => 'El campo estado es obligatorio.',
            'status.in' => 'El estado debe ser uno de los siguientes: programado, completado, cancelado.',

            // 'scheduled_at.date' => 'La fecha programada debe ser una fecha válida.',

            'notes.string' => 'Las notas deben ser un texto.',
            'notes.max' => 'Las notas no pueden exceder los 1000 caracteres.',

            'payment_status.required' => 'El campo estado de pago es obligatorio.',
            'payment_status.in' => 'El estado de pago debe ser uno de los siguientes: pendiente, pagado, reembolsado.',

            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser menor que 0.',

            'consultation_type.required' => 'El campo tipo de consulta es obligatorio.',
            'consultation_type.in' => 'El tipo de consulta debe ser uno de los siguientes: domiciliaria, consultorio.',

            // Si decides habilitar las siguientes reglas, puedes agregar sus mensajes aquí:
            // 'completed_at.date_format' => 'La fecha de finalización debe tener el formato Y-m-d H:i:s.',
        ];
    }
}
