import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateConsultationFormData, Patient, Service, Subscription, User } from "@/types";
import Select from 'react-select';
import { useEffect } from 'react';
import { DateTimePicker } from "@/components/DateTimePicker";
import ServicesTable from "./ServicesTable";

type ConsultationsFormProps = {
    data: CreateConsultationFormData;
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
        consultation_type?: string;
        amount?: string;
    };
};

export default function ConsultationsForm({ data, patients = [], users, services, setData, errors }: ConsultationsFormProps) {
    const userOptions = users.map(user => ({ value: String(user.id), label: user.name + ' ' + user.lastname }));
    const currentPatient = data.patient || patients.find(p => p.id === data.patient_id);
    const hasActiveSubscription = currentPatient?.subscriptions?.some((sub: Subscription) => sub.status === 'active');
    const patientOptions = Array.isArray(patients) ? patients.map(patient => ({
        value: String(patient.id),
        label: `${patient.name} ${patient.lastname} ( C.I: ${patient.identification} )`
    })) : [];
    const serviceOptions = services.map(service => ({ value: String(service.id), label: service.name + ' - $ ' + service.price }));

    const statusOptions = [
        { value: 'programado', label: 'Programado' },
        { value: 'completado', label: 'Completado' },
        { value: 'cancelado', label: 'Cancelado' },
    ];

    const paymentStatusOptions = [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'reembolsado', label: 'Reembolsado' },
    ];

    const consultationTypeOptions = [
        { value: 'domiciliaria', label: 'Domiciliaria' },
        { value: 'consultorio', label: 'Consultorio' },
    ];

    useEffect(() => {
        if (hasActiveSubscription) {
            setData('amount', 0);
        } else {
            const totalAmount = data.service_id.reduce((total, serviceId) => {
                const service = services.find(s => s.id === serviceId);
                return total + (service ? parseFloat(String(service.price)) : 0);
            }, 0);
            setData('amount', totalAmount);
        }
    }, [data.service_id, hasActiveSubscription, services, setData]);

    const selectedServices = services
        .filter(service => data.service_id.includes(service.id))
        .map(service => ({
            ...service,
            price: hasActiveSubscription ? 0 : service.price
        }));

    return (
        <>
            <div>
                <Label htmlFor="user_id" className="my-2 block font-semibold text-gray-700">Fisioterapeuta</Label>
                <Select
                    id="user_id"
                    options={userOptions}
                    value={userOptions.find(option => option.value === String(data.user_id)) || null}
                    onChange={(selectedOption) => setData('user_id', selectedOption ? Number(selectedOption.value) : null)}
                    isSearchable
                    placeholder="Select User..."
                    className="rounded-md"
                />
                <InputError message={errors.user_id} />
            </div>

            {patientOptions.length > 0 && (
                <div>
                    <Label htmlFor="patient_id" className="my-2 block font-semibold text-gray-700">Paciente</Label>
                    <Select
                        id="patient_id"
                        options={patientOptions}
                        value={patientOptions.find(option => option.value === String(data.patient_id)) || null}
                        onChange={(selectedOption) => setData('patient_id', selectedOption ? Number(selectedOption.value) : null)}
                        isSearchable
                        placeholder="Select Patient..."
                        className="rounded-md"
                    />
                    <InputError message={errors.patient_id} />
                </div>
            )}

            <div>
                <Label htmlFor="consultation_type" className="my-2 block font-semibold text-gray-700">Tipo de Consulta</Label>
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
                <Label htmlFor="status" className="my-2 block font-semibold text-gray-700">Estado de la asistencia</Label>
                <Select
                    id="status"
                    options={statusOptions}
                    value={statusOptions.find(option => option.value === data.status) || null}
                    onChange={(selectedOption) => setData('status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Selecciona el estado..."
                    className="rounded-md"
                />
                <InputError message={errors.status} />
            </div>

            <div>
                <Label htmlFor="payment_status" className="my-2 block font-semibold text-gray-700">Estado de Pago</Label>
                <Select
                    id="payment_status"
                    options={paymentStatusOptions}
                    value={paymentStatusOptions.find(option => option.value === data.payment_status) || null}
                    onChange={(selectedOption) => setData('payment_status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Selecciona el estado de pago..."
                    className="rounded-md"
                />
                <InputError message={errors.payment_status} />
            </div>

            <div>
                <Label htmlFor="scheduled_at" className="my-2 block font-semibold text-gray-700">Fecha programada</Label>
                <DateTimePicker
                    value={data.scheduled_at}
                    onChange={(newValue) => setData('scheduled_at', newValue)}
                />
                <InputError message={errors.scheduled_at} />
            </div>

            <div className="col-span-full">
                <Label htmlFor="service_id" className="my-2 block font-semibold text-gray-700">Servicios</Label>
                <Select
                    id="service_id"
                    options={serviceOptions}
                    isMulti
                    value={serviceOptions.filter(option => data.service_id.map(String).includes(option.value))}
                    onChange={(selectedOptions) => setData('service_id', (selectedOptions || []).map(option => Number(option.value)))}
                    isSearchable
                    placeholder="Select Services..."
                    className="rounded-md"
                />
                <InputError message={errors.service_id} />
            </div>

            <div className="col-span-full">
                <Label htmlFor="notes" className="my-2 block font-semibold text-gray-700">Notas (Opcional)</Label>
                <Input
                    id="notes"
                    type="text"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="rounded-md"
                />
                <InputError message={errors.notes} />
            </div>

            <ServicesTable className="col-span-full" services={selectedServices} />

            <div>
                <Label className="my-2 block font-semibold text-gray-700">Total</Label>
                <Input
                    type="text"
                    value={`$ ${(typeof data.amount === 'number' ? data.amount.toFixed(2) : '0.00')}`}
                    readOnly
                    className="rounded-md bg-gray-200"
                />
            </div>
        </>
    );
}
