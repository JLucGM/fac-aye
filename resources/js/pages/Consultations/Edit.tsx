import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Consultation, Patient, PaymentMethod, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConsultationsForm from './ConsultationsForm';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Consultations', href: '/consultations' },
    { title: 'Edit Consultation', href: '#' },
];

export default function Edit({ consultation, patients, users, services, paymentMethods }: { consultation: Consultation, patients: Patient[], users: User[], services: Service[], paymentMethods: PaymentMethod[] }) {
    console.log(consultation); // Verifica que la propiedad payments esté presente

    // Extraer datos de pago si existen
    const payment = consultation.payments && consultation.payments.length > 0 ? consultation.payments[0] : null;

    const { data, setData, errors, put } = useForm({
        user_id: consultation.user_id,
        patient_id: consultation.patient_id,
        service_id: consultation.services?.map((service: Service) => service.id) ?? [],
        status: consultation.status,
        scheduled_at: consultation.scheduled_at ? new Date(consultation.scheduled_at).toISOString().slice(0, 16) : '',
        notes: consultation.notes || '',
        payment_status: consultation.payment_status || '',
        consultation_type: consultation.consultation_type || '',
        amount: consultation.amount || 0,
        payment_method_id: payment ? payment.payment_method_id : null, // Asignar el método de pago si existe
        reference: payment ? payment.reference : '', // Asignar la referencia si existe
        paid_at: payment ? new Date(payment.paid_at).toISOString().split('T')[0] : '', // Asignar la fecha de pago si existe
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(data);
        e.preventDefault();
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);
        put(routeFn('consultations.update', consultation.id), {
            onSuccess: () => {
                // toast("Consulta actualizada con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar la consulta:", err);
                // toast("Error al actualizar la consulta.");
            },
        });
    };

    const paymentMethodOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.name
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Consultation" />
            <ContentLayout>

                <Heading
                    title="Editar consulta"
                    description="Manage your consultations"
                />

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <ConsultationsForm
                        data={data}
                        patients={patients}
                        users={users}
                        services={services}
                        setData={setData}
                        errors={errors}
                    />

                    <h1 className='text-xl'>Pago</h1>
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
                        <Label htmlFor="reference">Referencia</Label>
                        <Input
                            id="reference"
                            type="text"
                            name="reference"
                            value={data.reference}
                            className="mt-1 block w-full"
                            onChange={e => setData('reference', e.target.value)}
                        />
                        <InputError message={errors.reference} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="paid_at">Fecha de Pago</Label>
                        <Input
                            id="paid_at"
                            type="date"
                            name="paid_at"
                            value={data.paid_at}
                            className="mt-1 block w-full"
                            onChange={e => setData('paid_at', e.target.value)}
                        />
                        <InputError message={errors.paid_at} className="mt-2" />
                    </div>

                    <Button variant={"default"}>Actualizar Consulta</Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
