import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PaymentsFormProps = {
    data: {
        patient_id: string;
        consultation_id: string;
        payment_method_id: string;
        amount: number;
        status: string;
        reference: string;
        notes: string;
        paid_at: string;
    };
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
export default function PaymentsForm({ data, setData, errors }: PaymentsFormProps) {
    return (
        <>
            <div>
                <Label htmlFor="patient_id">Patient ID</Label>
                <Input
                    id="patient_id"
                    type="text"
                    name="patient_id"
                    value={data.patient_id}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('patient_id', e.target.value)}
                />
                <InputError message={errors.patient_id} className="mt-2" />
            </div>


            <div>
                <Label htmlFor="consultation_id">Consulta ID</Label>
                <Input
                    id="consultation_id"
                    type="text"
                    name="consultation_id"
                    value={data.consultation_id}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('consultation_id', e.target.value)}
                />
                <InputError message={errors.consultation_id} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="payment_method_id">Método de Pago ID</Label>
                <Input
                    id="payment_method_id"
                    type="text"
                    name="payment_method_id"
                    value={data.payment_method_id}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('payment_method_id', e.target.value)}
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

            {/* <div>
    <Label htmlFor="paid_at">Pagado En</Label>
    <Input
        id="paid_at"
        type="date" // Cambiado a tipo de fecha
        name="paid_at"
        value={data.paid_at} // Asegúrate de que no sea null
        className="mt-1 block w-full"
        onChange={(e) => setData('paid_at', e.target.value)}
    />
    <InputError message={errors.paid_at} className="mt-2" />
</div> */}



        </>
    );
}