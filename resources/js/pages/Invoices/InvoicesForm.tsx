import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateInvoiceFormData, InvoiceItemFormData, Patient, PaymentMethod } from "@/types";
import SelectReact from 'react-select';

type InvoicesFormProps = {
    data: CreateInvoiceFormData;
    setData: (key: string, value: any) => void;
    errors: {
        patient_id?: string;
        invoice_date?: string;
        notes?: string;
        'items.0.service_name'?: string; // Cambiado a service_name
        [key: string]: string | undefined; // Permitir claves dinámicas
    };
    patients: Patient[];
    paymentMethods: PaymentMethod[];
};

export default function InvoicesForm({ data, setData, errors, patients, paymentMethods }: InvoicesFormProps) {
    const patientOptions = patients.map(patient => ({
        value: patient.id,
        label: `${patient.name} ${patient.lastname} (C.I: ${patient.identification})`
    }));

    const paymentMethodOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.name
    }));

    const addInvoiceItem = () => {
        setData('items', [
            ...data.items,
            {
                id: null,
                service_name: '', // Agregar el campo para el nombre del servicio
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

            <div>
                <Label htmlFor="payment_method_id">Método de Pago</Label>
                <Select
                    id="payment_method_id"
                    options={paymentMethodOptions}
                    value={paymentMethodOptions.find(option => option.value === data.payment_method_id) || null}
                    onChange={selectedOption => setData('payment_method_id', selectedOption ? selectedOption.value : null)}
                    isSearchable
                    placeholder="Selecciona un método de pago..."
                    className="rounded-md mt-1 block w-full"
                />
                <InputError message={errors.payment_method_id} className="mt-2" />
            </div>

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
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeInvoiceItem(index)}
                    >
                        X
                    </Button>

                    {/* Campo de Nombre del Servicio */}
                    <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`service_name_${index}`}>Nombre del Servicio</Label>
                        <Input
                            id={`service_name_${index}`}
                            type="text"
                            name={`items[${index}][service_name]`}
                            value={item.service_name}
                            className="mt-1 block w-full"
                            onChange={(e) => handleItemChange(index, 'service_name', e.target.value)}
                        />
                        <InputError message={errors[`items.${index}.service_name`]} className="mt-2" />
                    </div>

                    {/* Campo de Cantidad */}
                    <div>
                        <Label className="my-2 block font-semibold text-gray-700" htmlFor={`quantity_${index}`}>Cantidad</Label>
                        <Input
                            id={`quantity_${index}`}
                            type="number"
                            name={`items[${index}][quantity]`}
                            value={item.quantity}
                            className="mt-1 block w-full"
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            min="1"
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
                            className="mt-1 block w-full"
                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
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
                            className="mt-1 block w-full"
                            readOnly
                        />
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addInvoiceItem} className="mt-4">
                Agregar Ítem de Servicio
            </Button>
        </>
    );
}
