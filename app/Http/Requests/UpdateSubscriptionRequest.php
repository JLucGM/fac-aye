<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriptionRequest extends FormRequest
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
            'type' => 'required|string|in:semanal,mensual,anual',
            'description' => 'nullable|string|max:255',
            'consultations_allowed' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',

            'type.required' => 'El campo tipo de funcional es obligatorio.',
            'type.in' => 'El tipo de funcional debe ser uno de los siguientes: semanal, mensual, anual.',

            'description.string' => 'La descripción debe ser un texto.',
            'description.max' => 'La descripción no puede exceder los 255 caracteres.',

            'consultations_allowed.required' => 'El campo asistencias permitidas es obligatorio.',
            'consultations_allowed.integer' => 'Las asistencias permitidas deben ser un número entero.',
            'consultations_allowed.min' => 'Las asistencias permitidas deben ser al menos 1.',

            'price.required' => 'El campo precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser menor que 0.',
        ];
    }
}