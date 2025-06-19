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
            // 'service_id' => 'required|exists:services,id',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|in:scheduled,completed,cancelled',
            'payment_status' => 'required|in:pending,paid,refunded',
            'scheduled_at' => 'nullable|date',
            // 'completed_at' => 'nullable|date|after_or_equal:scheduled_at',
            'amount' => 'nullable|numeric|min:0',
            'consultation_type' => 'required|in:domiciliary,office',
            
            'payment_method_id' => 'required|integer|exists:payment_methods,id',
            'reference' => 'nullable|string',
            'paid_at' => 'required|date',
        ];
    }
}
