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
            'consultation_ids' => 'required|array',
            'consultation_ids.*' => 'exists:consultations,id', // Asegúrate de que las consultas existan
            'payment_method_id' => 'required|exists:payment_methods,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'paid_at' => 'nullable|date', // Si es necesario
        ];
    }
}
