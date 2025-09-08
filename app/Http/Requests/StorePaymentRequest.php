<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
    public function rules()
    {
        return [
            'patient_id' => 'required|exists:patients,id',  // <-- agregar esta línea

            'payment_type' => 'required|string|in:consulta,suscripcion',

            'consultation_ids' => 'required_if:payment_type,consulta|array',
            'consultation_ids.*' => 'exists:consultations,id',

            'subscription_ids' => 'required_if:payment_type,suscripcion|array',
            'subscription_ids.*' => 'exists:patient_subscriptions,id',

            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string|in:pendiente,parcial,pagado,incobrable,reembolsado',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'paid_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'payment_type.required' => 'El tipo de pago es obligatorio.',
            'payment_type.in' => 'El tipo de pago debe ser "consulta" o "suscripcion".',

            'consultation_ids.required' => 'El campo de consultas es obligatorio.',
            'consultation_ids.array' => 'El campo de consultas debe ser un array.',
            'consultation_ids.*.exists' => 'Una o más consultas seleccionadas no existen.',

            'payment_method_id.required' => 'El campo método de pago es obligatorio.',
            'payment_method_id.exists' => 'El método de pago seleccionado no existe.',

            'amount.required' => 'El campo monto es obligatorio.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser menor que 0.',

            'status.required' => 'El campo estado es obligatorio.',
            'status.string' => 'El estado debe ser un texto.',

            'reference.string' => 'La referencia debe ser un texto.',
            'reference.max' => 'La referencia no puede exceder los 255 caracteres.',

            'notes.string' => 'Las notas deben ser un texto.',
            'notes.max' => 'Las notas no pueden exceder los 255 caracteres.',

            'paid_at.date' => 'La fecha de pago debe ser una fecha válida.',

            'subscription_ids.required_if' => 'El campo de suscripciones es obligatorio cuando el tipo de pago es suscripción.',
            'subscription_ids.array' => 'El campo de suscripciones debe ser un array.',
            'subscription_ids.*.exists' => 'Una o más suscripciones seleccionadas no existen.',
        ];
    }
}
