<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
            'lastname' => 'nullable|string|max:255',
            'identification' => 'required|string|max:255|unique:users,identification,' . $this->route('user')->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $this->route('user')->id,
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'active' => 'boolean',
            'phone' => 'nullable|string|max:15',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',

            'lastname.string' => 'El apellido debe ser un texto.',
            'lastname.max' => 'El apellido no puede exceder los 255 caracteres.',

            'identification.required' => 'El campo identificación es obligatorio.',
            'identification.unique' => 'La identificación ya está en uso.',

            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico es inválido.',
            'email.unique' => 'El correo electrónico ya está en uso.',

            'password.confirmed' => 'La confirmación de contraseña no coincide.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',

            'active.boolean' => 'El campo activo debe ser verdadero o falso.',

            'phone.string' => 'El teléfono debe ser un texto.',
            'phone.max' => 'El teléfono no puede exceder los 15 caracteres.',
        ];
    }
}