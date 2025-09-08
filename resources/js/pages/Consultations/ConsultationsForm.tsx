import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateConsultationFormData, Patient, Service, Subscription, User } from "@/types";
import Select from 'react-select';
import { useEffect } from 'react';
import ServicesTable from "./ServicesTable";

type ConsultationsFormProps = {
    data: CreateConsultationFormData;
    patients: Patient[];
    users: User[];
    services: Service[];
    activeSubscription?: Subscription | null; // Nueva prop opcional
    setData: (key: string, value: any) => void;
    errors: {
        user_id?: string;
        patient_id?: string;
        service_id?: string;
        status?: string;
        notes?: string;
        payment_status?: string;
        consultation_type?: string;
        amount?: string;
    };
};

export default function ConsultationsForm({
    data,
    patients = [],
    users,
    services,
    setData,
    errors,
    activeSubscription,
}: ConsultationsFormProps) {
    const userOptions = users.map(user => ({ value: String(user.id), label: user.name + ' ' + user.lastname }));
    const currentPatient = data.patient || patients.find(p => p.id === data.patient_id);
    const activeSub = activeSubscription ?? currentPatient?.subscriptions?.find((sub: Subscription) => sub.status === 'active');
    const hasActiveSubscription = !!activeSub;

    const patientOptions = Array.isArray(patients) ? patients.map(patient => ({
        value: String(patient.id),
        label: `${patient.name} ${patient.lastname} ( C.I: ${patient.identification} )`
    })) : [];

    const serviceOptions = services.map(service => ({
        value: String(service.id),
        label: `${service.name} - $ ${service.price}`
    }));

    // Opciones de estado de pago basadas en si se usa funcional o no
    const paymentStatusOptions = data.subscription_use === 'yes'
        ? [{ value: 'pagado', label: 'Pagado' }]
        : [
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'reembolsado', label: 'Reembolsado' },
        ];

    const consultationTypeOptions = [
        { value: 'domiciliaria', label: 'Domiciliaria' },
        { value: 'consultorio', label: 'Consultorio' },
    ];

    useEffect(() => {
        const total = data.service_id.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return total + (data.subscription_use === 'yes' ? 0 : parseFloat(service?.price || '0'));
        }, 0);
        setData('amount', total);
    }, [data.service_id, data.subscription_use, services]);

    useEffect(() => {
        if (data.subscription_use === 'yes') {
            setData('service_id', []); // Vaciar servicios porque se usa suscripción
            setData('payment_status', 'pagado');
        } else {
            setData('payment_status', 'pendiente');
        }
    }, [data.subscription_use]);

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
                    placeholder="Selecciona un fisioterapeuta..."
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
                        placeholder="Selecciona un paciente..."
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

            {/* <div>
                <Label htmlFor="payment_status" className="my-2 block font-semibold text-gray-700">Estado de Pago</Label>
                <Select
                    id="payment_status"
                    options={paymentStatusOptions}
                    value={paymentStatusOptions.find(option => option.value === data.payment_status) || null}
                    onChange={(selectedOption) => setData('payment_status', selectedOption?.value ?? '')}
                    isSearchable
                    placeholder="Selecciona el estado de pago..."
                    className="rounded-md"
                    isDisabled={data.subscription_use === 'yes'}
                />
                <InputError message={errors.payment_status} />
            </div> */}

            {hasActiveSubscription && (
                <div className="">
                    <div>
                        <Label htmlFor="subscription_use" className="my-2 block font-semibold text-gray-700">¿Usar Funcional?</Label>
                        <Select
                            id="subscription_use"
                            options={[
                                { value: 'no', label: 'No usar funcional' },
                                { value: 'yes', label: 'Usar funcional' }
                            ]}
                            value={data.subscription_use === 'yes' ? { value: 'yes', label: 'Usar funcional' } : { value: 'no', label: 'No usar funcional' }}
                            onChange={(option) => setData('subscription_use', option?.value || 'no')}
                            isSearchable
                            placeholder="Selecciona..."
                            className="rounded-md"
                        />
                    </div>

                    {data.subscription_use === 'yes' && (
                        <p className="text-sm text-blue-600 mt-2">
                            Se aplicará la funcional #{activeSub?.id} (Consultas restantes: {activeSub?.consultations_remaining})
                        </p>
                    )}
                    {data.subscription_use === 'no' && (
                        <p className="text-sm text-blue-600 mt-2">
                            No se aplicará ninguna funcionalidad adicional. <br />
                            Si eliminas el uso de la funcional, se reintegrará la consulta usada.
                        </p>
                    )}
                </div>
            )}

            <div className="col-span-full">
                <Label htmlFor="service_id" className="my-2 block font-semibold text-gray-700">Servicios</Label>
                {data.subscription_use === 'yes' && activeSub ? (
                    <input
                        type="text"
                        readOnly
                        value={activeSub.subscription?.name || activeSub.name}
                        className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                    />
                ) : (
                    <Select
                        id="service_id"
                        options={serviceOptions}
                        isMulti
                        value={serviceOptions.filter(option => data.service_id.map(String).includes(option.value))}
                        onChange={(selectedOptions) => setData('service_id', (selectedOptions || []).map(option => Number(option.value)))}
                        isSearchable
                        placeholder="Selecciona servicios..."
                        className="rounded-md"
                        isDisabled={data.subscription_use === 'yes'}
                    />
                )}
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

            <ServicesTable
                className="col-span-full"
                services={
                    data.subscription_use === 'yes' && activeSub
                        ? [{
                            id: `subscription-${activeSub.id}`,
                            name: activeSub.subscription?.name || activeSub.name,
                            price: 0,
                        }]
                        : data.service_id.map(id => {
                            const service = services.find(s => s.id === id);
                            return {
                                ...service,
                                price: service ? service.price : 0,
                            };
                        })
                }
            />

            <div className="">
                Total: ${
                    data.service_id.reduce((total, serviceId) => {
                        const service = services.find(s => s.id === serviceId);
                        return total + (data.subscription_use === 'yes' ? 0 : parseFloat(service?.price || '0'));
                    }, 0).toFixed(2)
                }
            </div>
        </>
    );
}
