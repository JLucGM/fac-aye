<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
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
            'permissions' => 'array', // Asegúrate de que sea un array
            'permissions.*' => 'string|exists:permissions,name', // Validar que cada permiso sea un string y exista en la tabla de permisos
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',

            'permissions.array' => 'Los permisos deben ser un array.',

            'permissions.*.string' => 'Cada permiso debe ser un texto.',
            'permissions.*.exists' => 'Uno o más permisos seleccionados no existen en la base de datos.',
        ];
    }
}
