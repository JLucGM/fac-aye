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
            'service_id' => 'required|exists:services,id',
            'status' => 'required|in:scheduled,completed,cancelled',
            'scheduled_at' => 'nullable|date',
            // 'completed_at' => 'nullable|date_format:Y-m-d H:i:s',
            'notes' => 'nullable|string|max:1000',
            'payment_status' => 'required|in:pending,paid,refunded',
        ];
    }
}
