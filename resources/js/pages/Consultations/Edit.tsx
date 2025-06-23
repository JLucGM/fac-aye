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
import { Download, Timer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Consultations', href: '/consultations' },
    { title: 'Edit Consultation', href: '#' },
];

export default function Edit({ consultation, patients, users, services, paymentMethods }: {
    consultation: Consultation & {
        payment?: Array<{
            id: number;
            payment_method_id: number;
            reference: string;
            // paid_at: string;
        }>
    },
    patients: Patient[],
    users: User[],
    services: Service[],
    paymentMethods: PaymentMethod[]
}) {
console.log('Edit Consultation Page Loaded', consultation);
    // Extraer datos de pago de manera segura
    const payment = consultation.payment && consultation.payment.length > 0 ? consultation.payment[0] : {
        payment_method_id: null,
        reference: '',
        // paid_at: ''
    };

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
        // Datos de pago
        payment_method_id: payment.payment_method_id,
        reference: payment.reference,
        // paid_at: payment.paid_at ? new Date(payment.paid_at).toISOString().split('T')[0] : '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);
        put(routeFn('consultations.update', consultation.id));
    };

    const assistpdf = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open(route('consultationpdf', consultation.id), '_blank'); // Abre en una nueva pestaña
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
                    description="Modifica los detalles de la consulta y la información de pago."
                >
                    <Button variant="default" onClick={assistpdf}>
                        <Download />
                        Descargar PDF
                    </Button>
                </Heading>

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-full md:col-span-2">

                            <ConsultationsForm
                                data={data}
                                patients={patients}
                                users={users}
                                services={services}
                                setData={setData}
                                errors={errors}
                            />

                        </div>
                        <div className="">
                            <h2 className="text-lg font-semibold">Información de Pago</h2>

                            {/* Método de Pago */}
                            <div>
                                <Label htmlFor="payment_method_id">Método de Pago</Label>
                                <Select
                                    id="payment_method_id"
                                    options={paymentMethodOptions}
                                    value={paymentMethodOptions.find(option => option.value === data.payment_method_id) || null}
                                    onChange={selectedOption => setData('payment_method_id', selectedOption?.value || null)}
                                    isSearchable
                                    placeholder="Selecciona un método de pago..."
                                    className="basic-single rounded-md mt-1 block w-full"
                                    classNamePrefix="select"
                                />
                                {errors.payment_method_id && (
                                    <InputError message={errors.payment_method_id} className="mt-2" />
                                )}
                            </div>

                            {/* Referencia */}
                            <div>
                                <Label htmlFor="reference">Referencia/Número de Transacción</Label>
                                <Input
                                    id="reference"
                                    type="text"
                                    value={data.reference}
                                    onChange={e => setData('reference', e.target.value)}
                                    placeholder="Ingrese la referencia de pago"
                                    className="mt-1 block w-full"
                                />
                                {errors.reference && (
                                    <InputError message={errors.reference} className="mt-2" />
                                )}
                            </div>

                            {/* Fecha de Pago */}
                            {/* <div>
                                <Label htmlFor="paid_at">Fecha de Pago</Label>
                                <Input
                                    id="paid_at"
                                    type="date"
                                    value={data.paid_at}
                                    onChange={e => setData('paid_at', e.target.value)}
                                    className="mt-1 block w-full bg-gray-200"
                                    readOnly
                                />
                                {errors.paid_at && (
                                    <InputError message={errors.paid_at} className="mt-2" />
                                )}
                            </div> */}
                        </div>
                    </div>
                    <Button type="submit" variant="default">
                        Actualizar Consulta
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
