// resources/js/Pages/Invoices/InvoicesForm.tsx

import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateInvoiceFormData, InvoiceItemFormData, Patient, Consultation } from "@/types";
import { useState, useEffect } from "react";
import SelectReact from 'react-select';

type InvoicesFormProps = {
    data: CreateInvoiceFormData;
    setData: (key: string, value: any) => void;
    errors: {
        patient_id?: string;
        invoice_date?: string;
        // due_date?: string;
        notes?: string;
        'items.0.description'?: string;
        [key: string]: string | undefined; // Permitir claves dinámicas
    };
    patients: Patient[];
    consultations: Consultation[];
    // Añadir una prop para indicar si estamos en modo edición
    isEditing?: boolean;
};

export default function InvoicesForm({ data, setData, errors, patients, consultations, isEditing = false }: InvoicesFormProps) {
    const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);

    const patientOptions = patients.map(patient => ({
        value: patient.id,
        label: `${patient.name} ${patient.lastname} (C.I: ${patient.identification})`
    }));

    useEffect(() => {
        if (data.patient_id) {
            const patientConsults = consultations.filter(
                c => c.patient_id === data.patient_id
            );
            setFilteredConsultations(patientConsults);
        } else {
            setFilteredConsultations([]);
        }
    }, [data.patient_id, consultations]);


    const addInvoiceItem = () => {
        setData('items', [
            ...data.items,
            {
                // No se necesita 'id' para nuevos ítems hasta que se guarden
                consultation_id: null,
                // description: '',
                quantity: 1,
                unit_price: 0,
                line_total: 0,
            }
        ]);
    };

    const removeInvoiceItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index: number, key: keyof InvoiceItemFormData, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [key]: value };

        // Recalcular line_total si cambian quantity o unit_price
        if (key === 'quantity' || key === 'unit_price') {
            const quantity = newItems[index].quantity || 0;
            const unitPrice = newItems[index].unit_price || 0;
            newItems[index].line_total = quantity * unitPrice;
        }

        // Si se selecciona una consulta, rellenar descripción y precio unitario
        if (key === 'consultation_id' && value) {
            const selectedConsultation = filteredConsultations.find(c => c.id === parseInt(value));
            if (selectedConsultation) {
                // newItems[index].description = `Consulta del ${selectedConsultation.scheduled_at}`;
                newItems[index].unit_price = selectedConsultation.amount;
                newItems[index].line_total = newItems[index].quantity * selectedConsultation.amount;
            }
        }

        setData('items', newItems);
    };

    return (
        <>
            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="invoice_number">Número de Factura</Label>
                <Input
                    id="invoice_number"
                    type="text"
                    name="invoice_number"
                    value={data.invoice_number}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('invoice_number', e.target.value)}
                />
                <InputError message={errors.invoice_number} className="mt-2" />
            </div>
            {/* Campo de Paciente (usando react-select) */}
            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="patient_id">Paciente</Label>
                <SelectReact
                    id="patient_id"
                    options={patientOptions}
                    value={patientOptions.find(option => option.value === data.patient_id) || null}
                    onChange={(selectedOption) =>
                        setData('patient_id', selectedOption ? selectedOption.value : null)
                    }
                    isSearchable
                    placeholder="Selecciona un paciente..."
                    className="rounded-md"
                />
                <InputError message={errors.patient_id} className="mt-2" />
            </div>

            {/* Campos de la Factura Principal (Fechas, Notas) */}
            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="invoice_date">Fecha de Factura</Label>
                <Input
                    id="invoice_date"
                    type="date"
                    name="invoice_date"
                    value={data.invoice_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('invoice_date', e.target.value)}
                />
                <InputError message={errors.invoice_date} className="mt-2" />
            </div>

            {/* <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="due_date">Fecha de Vencimiento</Label>
                <Input
                    id="due_date"
                    type="date"
                    name="due_date"
                    value={data.due_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('due_date', e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
            </div> */}

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="notes">Notas</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    value={data.notes}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            {/* Sección de Ítems de la Factura */}
            <h3 className="text-lg font-semibold mt-6 mb-3">Ítems de la Factura</h3>
            {data.items.map((item, index) => (
                <div key={item.id || `new-${index}`} className="border p-4 rounded-md mb-4 relative">
                    {/* Campo oculto para el ID del ítem si existe */}
                    {item.id && <input type="hidden" name={`items[${index}][id]`} value={item.id} />}

                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeInvoiceItem(index)}
                    >
                        X
                    </Button>

                    {/* Campo de Consulta */}
                    <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`consultation_${index}`}>Consulta Asociada</Label>
                        <Select
                            value={item.consultation_id?.toString() || ''}
                            onValueChange={(value) => handleItemChange(index, 'consultation_id', parseInt(value))}
                            disabled={!data.patient_id || filteredConsultations.length === 0}
                        >
                            <SelectTrigger id={`consultation_${index}`}>
                                <SelectValue placeholder="Selecciona una consulta" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredConsultations.map((consultation) => (
                                    <SelectItem key={consultation.id} value={consultation.id.toString()}>
                                        {consultation.scheduled_at} - {consultation.patient ? `${consultation.patient.name} ${consultation.patient.lastname}` : 'Paciente no disponible'} (ID: {consultation.id}) - ${consultation.amount}
                                    </SelectItem>

                                ))}
                            </SelectContent>
                        </Select>
                        {!data.patient_id && (
                            <p className="text-sm text-gray-500 mt-1">Selecciona un paciente para ver sus consultas.</p>
                        )}
                        {data.patient_id && filteredConsultations.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">No hay consultas disponibles para este paciente.</p>
                        )}
                        <InputError message={errors[`items.${index}.consultation_id`]} className="mt-2" />
                    </div>

                    {/* Campo de Descripción */}
                    {/* <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`description_${index}`}>Descripción</Label>
                        <Input
                            id={`description_${index}`}
                            type="text"
                            name={`items[${index}][description]`}
                            value={item.description}
                            className="mt-1 block w-full"
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                        <InputError message={errors[`items.${index}.description`]} className="mt-2" />
                    </div> */}

                    {/* Campo de Cantidad */}
                    <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`quantity_${index}`}>Cantidad</Label>
                        <Input
                            id={`quantity_${index}`}
                            type="number"
                            name={`items[${index}][quantity]`}
                            value={item.quantity}
                            className="mt-1 block w-full bg-gray-100"
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            min="1"
                            readOnly
                        />
                        <InputError message={errors[`items.${index}.quantity`]} className="mt-2" />
                    </div>

                    {/* Campo de Precio Unitario */}
                    <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`unit_price_${index}`}>Precio Unitario</Label>
                        <Input
                            id={`unit_price_${index}`}
                            type="number"
                            name={`items[${index}][unit_price]`}
                            value={item.unit_price}
                            className="mt-1 block w-full bg-gray-100"
                            readOnly
                        />
                        <InputError message={errors[`items.${index}.unit_price`]} className="mt-2" />
                    </div>

                    {/* Campo de Total de Línea (solo lectura) */}
                    <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`line_total_${index}`}>Total de Línea</Label>
                        <Input
                            id={`line_total_${index}`}
                            type="number"
                            value={item.line_total}
                            className="mt-1 block w-full bg-gray-100"
                            readOnly
                        />
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addInvoiceItem} className="mt-4">
                Agregar Ítem de Consulta
            </Button>
        </>
    );
}
