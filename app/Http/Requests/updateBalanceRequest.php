<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBalanceRequest extends FormRequest
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
            'balance' => 'required|numeric|min:-999999.99|max:999999.99',
            'credit' => 'required|numeric|min:0|max:999999.99',
            'description' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'balance.required' => 'El campo balance es obligatorio.',
            'balance.numeric' => 'El balance debe ser un número.',
            'balance.min' => 'El balance no puede ser menor que -999999.99.',
            'balance.max' => 'El balance no puede ser mayor que 999999.99.',

            'credit.required' => 'El campo crédito es obligatorio.',
            'credit.numeric' => 'El crédito debe ser un número.',
            'credit.min' => 'El crédito no puede ser menor que 0.',
            'credit.max' => 'El crédito no puede ser mayor que 999999.99.',

            'description.required' => 'El campo descripción es obligatorio.',
            'description.string' => 'La descripción debe ser un texto.',
            'description.max' => 'La descripción no puede exceder los 1000 caracteres.',
        ];
    }
}