<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
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
            'consultation_id' => 'nullable|exists:consultations,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'in:pendiente,parcial,pagado,incobrable,reembolsado',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'paid_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'El campo paciente es obligatorio.',
            'patient_id.exists' => 'El paciente seleccionado no existe.',

            'consultation_id.exists' => 'La consulta seleccionada no existe.',

            'payment_method_id.required' => 'El campo método de pago es obligatorio.',
            'payment_method_id.exists' => 'El método de pago seleccionado no existe.',

            'amount.required' => 'El campo monto es obligatorio.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser menor que 0.',

            'status.in' => 'El estado debe ser uno de los siguientes: pendiente, completado, fallido.',

            'reference.string' => 'La referencia debe ser un texto.',
            'reference.max' => 'La referencia no puede exceder los 255 caracteres.',

            'notes.string' => 'Las notas deben ser un texto.',
            'notes.max' => 'Las notas no pueden exceder los 1000 caracteres.',

            'paid_at.date' => 'La fecha de pago debe ser una fecha válida.',
        ];
    }
}
