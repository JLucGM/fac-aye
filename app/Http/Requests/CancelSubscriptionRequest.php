<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelSubscriptionRequest extends FormRequest
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
            'patient_subscription_id' => 'required|exists:patient_subscriptions,id',
            'reason' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'patient_subscription_id.required' => 'El campo suscripción del paciente es obligatorio.',
            'patient_subscription_id.exists' => 'La suscripción del paciente seleccionada no existe.',

            'reason.required' => 'El campo motivo es obligatorio.',
            'reason.string' => 'El motivo debe ser un texto.',
            'reason.max' => 'El motivo no puede exceder los 1000 caracteres.',
        ];
    }
}