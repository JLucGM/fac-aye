<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
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
            'email' => 'required|email|max:255|unique:patients,email,' . $this->route('patient')->id,
            'phone' => 'nullable|string|max:15',
            'birthdate' => 'nullable|date',
            'identification' => 'required|string|max:255',
            'doctor_id' => 'nullable|exists:doctors,id',
            'address' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',

            'lastname.required' => 'El campo apellido es obligatorio.',
            'lastname.string' => 'El apellido debe ser un texto.',
            'lastname.max' => 'El apellido no puede exceder los 255 caracteres.',

            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico es inválido.',
            'email.max' => 'El correo electrónico no puede exceder los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',

            'phone.string' => 'El teléfono debe ser un texto.',
            'phone.max' => 'El teléfono no puede exceder los 15 caracteres.',

            'birthdate.date' => 'La fecha de nacimiento debe ser una fecha válida.',

            'identification.required' => 'El campo identificación es obligatorio.',
            'identification.string' => 'La identificación debe ser un texto.',
            'identification.max' => 'La identificación no puede exceder los 255 caracteres.',

            'address.string' => 'La dirección debe ser un texto.',
            'address.max' => 'La dirección no puede exceder los 255 caracteres.',

            'doctor_id.exists' => 'El doctor seleccionado no existe.',
        ];
    }
}
