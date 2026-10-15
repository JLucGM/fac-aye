<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFirstVisitRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:15',
            'birthdate' => 'nullable|date',
            'identification' => 'required|string|max:255',
            'user_id' => 'required|integer|exists:users,id',
            'service_id' => [
                'array',
                Rule::exists('services', 'id'),
                Rule::requiredIf(function () {
                    return ($this->input('subscription_use') ?? 'no') !== 'yes';
                }),
            ],
            'status' => 'required|string|in:programado,completado,cancelado',
            'scheduled_at' => 'nullable|date',
            'consultation_type' => 'required|string|in:domiciliaria,consultorio',
            'notes' => 'nullable|string|max:1000',
            'payment_status' => 'nullable|string|in:pendiente,parcial,pagado,reembolsado,incobrable',
            'amount' => 'nullable|numeric|min:0',
            'address' => 'nullable|string|max:255',
            'doctor_id' => 'nullable|integer|exists:doctors,id',
            'subscription_id' => 'nullable|integer|exists:subscriptions,id',
            'subscription_use' => 'nullable|string|in:yes,no',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'lastname.required' => 'El campo apellido es obligatorio.',
            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico es inválido.',
            'identification.required' => 'El campo identificación es obligatorio.',
            'user_id.required' => 'El campo fisioterapeuta es obligatorio.',
            'user_id.exists' => 'El fisioterapeuta seleccionado no existe.',
            'service_id.required' => 'El campo servicio es obligatorio.',
            'service_id.array' => 'El campo servicio debe ser un array.',
            'service_id.*.exists' => 'Uno o más servicios seleccionados no existen.',
            'status.in' => 'El estado debe ser uno de los siguientes: programado, completado, cancelado.',
            'consultation_type.in' => 'El tipo de consulta debe ser uno de los siguientes: domiciliaria, consultorio.',
            'payment_status.in' => 'El estado de pago debe ser uno de los siguientes: pendiente, parcial, pagado, reembolsado, incobrable.',
            'amount.numeric' => 'El monto debe ser un número.',
            'amount.min' => 'El monto no puede ser menor que 0.',
            'doctor_id.exists' => 'El doctor seleccionado no existe.',
            'subscription_id.exists' => 'La suscripción seleccionada no existe.',
            'subscription_use.in' => 'El campo uso de funcional debe ser "yes" o "no".',
        ];
    }
}