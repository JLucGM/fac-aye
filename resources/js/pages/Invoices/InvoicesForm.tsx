import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateInvoiceFormData, InvoiceItemFormData, Patient, PaymentMethod } from "@/types";
import { Trash } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type InvoicesFormProps = {
    data: CreateInvoiceFormData;
    setData: (key: string, value: any) => void;
    errors: {
        patient_id?: string;
        invoice_date?: string;
        notes?: string;
        payment_method_id?: string;
        // invoice_img?: string;
        'items.0.service_name'?: string;
        [key: string]: string | undefined;
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
                service_name: '',
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

    // Calcular el total de la factura
    const calculateTotal = () => {
    return data.items.reduce((total, item) => total + parseFloat(item.line_total), 0);
};


    return (
        <>
            {/* <div>
                <Label htmlFor="invoice_img">Adjuntar factura (opcional)</Label>
                <Input
                    id="invoice_img"
                    type="file"
                    name="invoice_img"
                    className="mt-1 block w-full"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setData('invoice_img', e.target.files[0]); // SOLO un archivo, no array
                        } else {
                            setData('invoice_img', null);
                        }
                    }}
                    accept="image/*"
                />
                <Label htmlFor="invoice_img" className='text-gray-500 text-sm'>Adjunte foto de la factura física.</Label>
                <InputError message={errors.invoice_img} className="mt-2" />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="invoice_number">Número de Factura</Label>
                    <Input
                        id="invoice_number"
                        type="text"
                        name="invoice_number"
                        value={data.invoice_number}
                        className="block w-full"
                        onChange={(e) => setData('invoice_number', e.target.value)}
                    />
                    <Label htmlFor="invoice_number" className='text-gray-500 text-sm'>Se auto-generación de números de factura, puede personalizarlo.</Label>
                    <InputError message={errors.invoice_number} className="mt-2" />
                </div>

                <div>
                    <Label htmlFor="invoice_date">Fecha de Factura</Label>
                    <Input
                        id="invoice_date"
                        type="date"
                        name="invoice_date"
                        value={data.invoice_date}
                        className="block w-full"
                        onChange={(e) => setData('invoice_date', e.target.value)}
                    />
                    <InputError message={errors.invoice_date} className="mt-2" />
                </div>

                <div>
                    <Label htmlFor="patient_id">Paciente</Label>
                    <Select
                        id="patient_id"
                        options={patientOptions}
                        value={patientOptions.find(option => option.value === data.patient_id) || null}
                        onChange={(selectedOption) =>
                            setData('patient_id', selectedOption ? selectedOption.value : (patientOptions[0]?.value || null))
                        }
                        isSearchable
                        placeholder="Selecciona un paciente..."
                        className="block w-full"
                    />
                    <InputError message={errors.patient_id} className="mt-2" />
                </div>

                <div>
                    <Label htmlFor="payment_method_id">Método de Pago</Label>
                    <Select
                        id="payment_method_id"
                        options={paymentMethodOptions}
                        value={paymentMethodOptions.find(option => option.value === data.payment_method_id) || null}
                        onChange={selectedOption =>
                            setData('payment_method_id', selectedOption ? selectedOption.value : (paymentMethodOptions[0]?.value || null))
                        }
                        isSearchable
                        placeholder="Selecciona un método de pago..."
                        className="block w-full"
                    />
                    <InputError message={errors.payment_method_id} className="mt-2" />
                </div>
            </div>

            <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    value={data.notes}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <Label htmlFor="notes" className='text-gray-500 text-sm'>Notas sobre la factura.</Label>
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Ítems de la Factura</h3>
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[15%]">Cantidad</TableHead>
                            <TableHead className="w-[40%] text-right">Descripción</TableHead>
                            <TableHead className="w-[20%] text-right">P. Unitario</TableHead>
                            <TableHead className="w-[20%] text-right">Total</TableHead>
                            <TableHead className="w-[5%] text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No hay ítems en la factura.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.items.map((item, index) => (
                                <TableRow key={item.id || `new-${index}`}>
                                    <TableCell className="text-right">
                                        <Input
                                            id={`quantity_${index}`}
                                            type="number"
                                            name={`items[${index}][quantity]`}
                                            value={item.quantity}
                                            className="w-full"
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                            min={1}
                                        />
                                        <InputError message={errors[`items.${index}.quantity`]} className="mt-1" />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            id={`service_name_${index}`}
                                            type="text"
                                            name={`items[${index}][service_name]`}
                                            value={item.service_name}
                                            className="w-full"
                                            onChange={(e) => handleItemChange(index, 'service_name', e.target.value)}
                                        />
                                        <InputError message={errors[`items.${index}.service_name`]} className="mt-1" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Input
                                            id={`unit_price_${index}`}
                                            type="number"
                                            name={`items[${index}][unit_price]`}
                                            value={item.unit_price}
                                            className="w-full"
                                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                            min={0}
                                            step="0.01"
                                        />
                                        <InputError message={errors[`items.${index}.unit_price`]} className="mt-1" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Input
                                            id={`line_total_${index}`}
                                            type="number"
                                            value={item.line_total}
                                            className="w-full bg-gray-100 dark:bg-gray-800 text-right"
                                            readOnly
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeInvoiceItem(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell colSpan={1} className="text-right font-semibold">
                                Total: ${calculateTotal()}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <Button type="button" variant="outline" onClick={addInvoiceItem} className="mt-4">
                Agregar Ítem
            </Button>
        </>
    );
}
