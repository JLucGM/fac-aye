import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Consultation, Patient, Service, User } from "@/types";
import Select from 'react-select';
import { useEffect } from 'react';

type ConsultationsFormProps = {
    data: Consultation;
    patients: Patient[];
    users: User[];
    services: Service[];
    setData: (key: string, value: any) => void;
    errors: {
        user_id?: string;
        patient_id?: string;
        service_id?: string;
        status?: string;
        scheduled_at?: string;
        notes?: string;
        payment_status?: string;
        consultation_type?: string; // Agregado
        amount?: string; // Agregado
    };
};

export default function ConsultationsForm({ data, patients, users, services, setData, errors }: ConsultationsFormProps) {
    const userOptions = users.map(user => ({ value: user.id, label: user.name + ' ' + user.lastname + ' ( C.I:' + user.identification + ')' }));
    const patientOptions = patients.map(patient => ({ value: patient.id, label: patient.name + ' ' + patient.lastname + ' ( C.I:' + patient.identification + ')' }));
    const serviceOptions = services.map(service => ({ value: service.id, label: service.name + ' - $ ' + service.price }));

    const statusOptions = [
        { value: 'scheduled', label: 'Programado' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
    ];
    const paymentStatusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'refunded', label: 'Reembolsado' },
    ];

    const consultationTypeOptions = [
        { value: 'domiciliary', label: 'A Domiciliaria' },
        { value: 'office', label: 'Consultorio' },
    ];

    const handleScheduledAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);
        const formattedDate = date.toISOString().slice(0, 19); // Formato Y-m-d H:i:s
        setData('scheduled_at', formattedDate);
    };

    // Calcular el monto total basado en los servicios seleccionados
    useEffect(() => {
        const totalAmount = data.service_id.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return total + (service ? parseFloat(service.price) : 0); // Asegúrate de convertir el precio a número
        }, 0);
        setData('amount', totalAmount);
    }, [data.service_id, services, setData]);


    return (
        <>
            <div>
                <Label htmlFor="user_id" className="mb-2 block font-semibold text-gray-700">User  ID</Label>
                <Select
                    id="user_id"
                    options={userOptions}
                    value={userOptions.find(option => option.value === data.user_id) || null}
                    onChange={(selectedOption) => setData('user_id', selectedOption?.value ?? null)}
                    isSearchable
                    placeholder="Select User..."
                    className="rounded-md"
                />
                <InputError message={errors.user_id} />
            </div>

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
                <Label htmlFor="service_id" className="mb-2 block font-semibold text-gray-700">Service ID</Label>
                <Select
                    id="service_id"
                    options={serviceOptions}
                    isMulti
                    value={serviceOptions.filter(option => data.service_id.includes(option.value))}
                    onChange={(selectedOptions) => setData('service_id', (selectedOptions || []).map(option => option.value))}
                    isSearchable
                    placeholder="Select Services..."
                    className="rounded-md"
                />
                <InputError message={errors.service_id} />
            </div>

            <div>
                <Label htmlFor="consultation_type" className="mb-2 block font-semibold text-gray-700">Tipo de Consulta</Label>
                <Select
                    id="consultation_type"
                    options={consultationTypeOptions}
                    value={consultationTypeOptions.find(option => option.value === data.consultation_type) || null}
                    onChange={(selectedOption) => setData('consultation_type', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Selecciona el tipo de consulta..."
                    className="rounded-md"
                />
                <InputError message={errors.consultation_type} />
            </div>

            <div>
                <Label htmlFor="scheduled_at" className="mb-2 block font-semibold text-gray-700">Fecha programada</Label>
                <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={data.scheduled_at}
                    onChange={handleScheduledAtChange} // Usar la función de manejo
                    className="rounded-md"
                />
                <InputError message={errors.scheduled_at} />
            </div>

            <div>
                <Label htmlFor="status" className="mb-2 block font-semibold text-gray-700">Status</Label>
                <Select
                    id="status"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === data.status) || null}
                    onChange={(selectedOption) => setData('status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Select Status..."
                    className="rounded-md"
                />
                <InputError message={errors.status} />
            </div>

            <div>
                <Label htmlFor="payment_status" className="mb-2 block font-semibold text-gray-700">Payment Status</Label>
                <Select
                    id="payment_status"
                    options={paymentStatusOptions}
                    value={paymentStatusOptions.find(option => option.value === data.payment_status) || null}
                    onChange={(selectedOption) => setData('payment_status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Select Payment Status..."
                    className="rounded-md"
                />
                <InputError message={errors.payment_status} />
            </div>

            <div>
                <Label htmlFor="notes" className="mb-2 block font-semibold text-gray-700">Notes</Label>
                <Input
                    id="notes"
                    type="text"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="rounded-md"
                />
                <InputError message={errors.notes} />
            </div>

            <div>
                <Label className="mb-2 block font-semibold text-gray-700">Total Amount</Label>
                <Input
                    type="text"
                    value={`$ ${(typeof data.amount === 'number' ? data.amount.toFixed(2) : '0.00')}`} // Verifica que amount sea un número
                    readOnly
                    className="rounded-md bg-gray-200"
                />
            </div>

            {/* <div>
                <Label htmlFor="amount" className="mb-2 block font-semibold text-gray-700">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    value={data.amount}
                    onChange={(e) => setData('amount', parseFloat(e.target.value))}
                    className="rounded-md"
                />
                <InputError message={errors.amount} />
            </div> */}
        </>
    );
}
