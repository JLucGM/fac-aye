import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { Consultation, Patient, PaymentMethod } from "@/types";

type PaymentsFormProps = {
    data: {
        patient_id: number | null;
        consultation_id: number | null;
        payment_method_id: number | null;
        amount: number;
        status: string;
        reference: string;
        notes: string;
        paid_at: string;
    };
    patients: Patient[];
    paymentMethods: PaymentMethod[];
    consultations: Consultation[];
    setData: (key: string, value: any) => void;
    errors: {
        patient_id?: string;
        consultation_id?: string;
        payment_method_id?: string;
        amount?: string;
        status?: string;
        reference?: string;
        notes?: string;
        paid_at?: string;
    };
};


export default function PaymentsForm({ data, patients, paymentMethods, consultations, setData, errors }: PaymentsFormProps) {
    const patientOptions = patients.map(patient => ({ value: patient.id, label: patient.name + ' ' + patient.lastname + ' ( C.I:' + patient.identification + ')' }));
    const consultationOptions = consultations.map(consultation => ({ value: consultation.id, label: consultation.id.toString() }));
    const paymentMethodOptions = paymentMethods.map(method => ({ value: method.id, label: method.name }));

    // Función auxiliar para obtener el valor como string o undefined
    const getValue = (options: { value: number; label: string; }[], id: number | null): string | undefined => {
        if (id === null) {
            return undefined;
        }
        const found = options.find(option => option.value === id);
        return found ? found.value.toString() : undefined;
    };

    // Define el tipo para selectedOption
    type SelectOption = { value: number; label: string; };

    return (
        <>
            <div>
                <Label htmlFor="patient_id" className="mb-2 block font-semibold text-gray-700">Patient ID</Label>
                <Select
                    id="patient_id"
                    options={patientOptions}
                    value={patientOptions.find(option => option.value === data.patient_id) || null}
                    onChange={(selectedOption) => setData('patient_id', selectedOption?.value ?? null)}
                    isSearchable
                    placeholder="Select Patient..."
                    className="rounded-md"
                />
                <InputError message={errors.patient_id} />
            </div>

            <div>
                <Label htmlFor="consultation_id">Consulta ID</Label>
                <Select
                    id="consultation_id"
                    options={consultationOptions}
                    value={consultationOptions.find(option => option.value === data.consultation_id) || null}
                    onChange={(selectedOption: SelectOption | null) => setData('consultation_id', selectedOption ? selectedOption.value : null)}
                    isSearchable
                    placeholder="Select Consultation..."
                    className="rounded-md mt-1 block w-full"
                />
                <InputError message={errors.consultation_id} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="payment_method_id">Método de Pago ID</Label>
                <Select
                    id="payment_method_id"
                    options={paymentMethodOptions}
                    value={paymentMethodOptions.find(option => option.value === data.payment_method_id) || null}
                    onChange={(selectedOption: SelectOption | null) => setData('payment_method_id', selectedOption ? selectedOption.value : null)}
                    isSearchable
                    placeholder="Select Payment Method..."
                    className="rounded-md mt-1 block w-full"
                />
                <InputError message={errors.payment_method_id} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="amount">Monto</Label>
                <Input
                    id="amount"
                    type="text"
                    name="amount"
                    value={data.amount}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('amount', e.target.value)}
                />
                <InputError message={errors.amount} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="status">Estado</Label>
                <Input
                    id="status"
                    type="text"
                    name="status"
                    value={data.status}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('status', e.target.value)}
                />
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="reference">Referencia</Label>
                <Input
                    id="reference"
                    type="text"
                    name="reference"
                    value={data.reference}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('reference', e.target.value)}
                />
                <InputError message={errors.reference} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="notes">Notas</Label>
                <Input
                    id="notes"
                    type="text"
                    name="notes"
                    value={data.notes}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

        </>
    );
}
