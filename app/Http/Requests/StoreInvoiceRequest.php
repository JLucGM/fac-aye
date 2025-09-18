<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'invoice_number' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'payment_method_id' => 'required|exists:payment_methods,id', // Validación para el método de pago
            'items' => 'required|array|min:1',
            'items.*.service_name' => 'required|string|max:255', // Validación para el nombre del servicio
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.line_total' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'El campo paciente es obligatorio.',
            'patient_id.exists' => 'El paciente seleccionado no existe.',
            'invoice_number.required' => 'El campo número de factura es obligatorio.',
            'invoice_number.string' => 'El número de factura debe ser una cadena de texto.',
            'invoice_number.max' => 'El número de factura no debe exceder los 255 caracteres.',
            'invoice_date.required' => 'El campo fecha de factura es obligatorio.',
            'invoice_date.date' => 'El campo fecha de factura debe ser una fecha válida.',
            'notes.string' => 'Las notas deben ser una cadena de texto.',
            'notes.max' => 'Las notas no deben exceder los 1000 caracteres.',
            'payment_method_id.required' => 'El campo método de pago es obligatorio.',
            'payment_method_id.exists' => 'El método de pago seleccionado no existe.',
            'items.required' => 'Debe agregar al menos un ítem a la factura.',
            'items.array' => 'Los ítems deben ser un arreglo válido.',
            'items.min' => 'Debe agregar al menos un ítem a la factura.',
            'items.*.service_name.required' => 'El nombre del servicio es obligatorio para cada ítem.',
            'items.*.service_name.string' => 'El nombre del servicio debe ser una cadena de texto.',
            'items.*.service_name.max' => 'El nombre del servicio no debe exceder los 255 caracteres.',
            'items.*.quantity.required' => 'La cantidad es obligatoria para cada ítem.',
            'items.*.quantity.integer' => 'La cantidad debe ser un número entero.',
            'items.*.quantity.min' => 'La cantidad debe ser al menos 1.',
            'items.*.unit_price.required' => 'El precio unitario es obligatorio para cada ítem.',
            'items.*.unit_price.numeric' => 'El precio unitario debe ser un número válido.',
            'items.*.unit_price.min' => 'El precio unitario no puede ser negativo.',
            'items.*.line_total.required' => 'El total de línea es obligatorio para cada ítem.',
            'items.*.line_total.numeric' => 'El total de línea debe ser un número válido.',
            'items.*.line_total.min' => 'El total de línea no puede ser negativo.',
        ];
    }

}
