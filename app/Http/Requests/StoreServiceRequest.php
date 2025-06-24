<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            // 'duration' => 'required|integer|min:1',
            // 'category_id' => 'required|exists:categories,id',
            // 'active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede exceder los 255 caracteres.',

            'description.string' => 'La descripción debe ser un texto.',

            'price.required' => 'El campo precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser menor que 0.',

            // Si decides habilitar las siguientes reglas, puedes agregar sus mensajes aquí:
            // 'duration.required' => 'El campo duración es obligatorio.',
            // 'duration.integer' => 'La duración debe ser un número entero.',
            // 'duration.min' => 'La duración debe ser al menos 1.',
            // 'category_id.required' => 'El campo categoría es obligatorio.',
            // 'category_id.exists' => 'La categoría seleccionada no existe.',
            // 'active.boolean' => 'El campo activo debe ser verdadero o falso.',
        ];
    }
}
