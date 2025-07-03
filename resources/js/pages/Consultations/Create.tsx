import { Consultation, CreateConsultationFormData, Patient, PaymentMethod, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {ContentLayout} from '@/layouts/content-layout';
import ConsultationsForm from './ConsultationsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Asistencias',
        href: '/consultations',
    },
    {
        title: 'Crear Asistencia',
        href: '#',
    },
];

export default function Create({ patients, users, services }: {
    patients: Patient[],
    users: User[],
    services: Service[],
    // paymentMethods: PaymentMethod[],
}) {
    const { data, setData, errors, post } = useForm<CreateConsultationFormData>({
        user_id: users[0].id,
        patient_id: patients[0].id,
        service_id: [],
        status: 'programado', // Cambia a 'programado' si es necesario
        scheduled_at: new Date().toISOString().slice(0, 19),
        consultation_type: 'consultorio', // Uncomment if you want to include consultation type
        // completed_at: '',
        notes: '',
        payment_status: 'pendiente',
        amount: 0,

        // campo de pago
        // payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null, // Cambia a null si no hay métodos de pago
        // reference: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        // console.log("Submitting consultation with data:", data);
        e.preventDefault();
        post(route('consultations.store'), {
            onSuccess: () => {
                // console.log("Paciente creado con éxito:", data);
                // toast("Paciente creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear la Asistencia:", err);
                // toast("Error al crear la asistencia.");
            },
        });
    };

    // const paymentMethodOptions = paymentMethods.map(method => ({
    //     value: method.id,
    //     label: method.name
    // }));

    // const selectedServices = services.filter(service => data.service_id.includes(service.id));
        
    return (
        // <AppLayout breadcrumbs={breadcrumbs}>
        
        <ContentLayout breadcrumbs={breadcrumbs}>
                <Head title="Crear Asistencia" />
                <Heading
                    title="Crear asistencia"
                    description="Aquí puedes crear una nueva asistencia para un paciente."
                />

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        <h1 className='text-xl col-span-full'>Información de la Asistencia</h1>
                        <ConsultationsForm
                            data={data}
                            patients={patients}
                            users={users}
                            services={services}
                            setData={setData}
                            errors={errors}
                        />
                    </div>

                    {/* <div className="">
                            <h1 className='text-xl'>Información de Pago</h1>
                            <div>
                                <Label htmlFor="payment_method_id" className="my-2 block font-semibold text-gray-700">Método de Pago</Label>
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
                                <Label htmlFor="reference" className="my-2 block font-semibold text-gray-700">Referencia  (Opcional)</Label>
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
                        </div> */}

                    {/* Aquí se muestra la tabla de servicios seleccionados */}
                    {/* <h2 className='text-xl mt-4'>Servicios Seleccionados</h2>
                    <ServicesTable services={selectedServices} /> */}

                    <Button
                        variant={"default"}
                    >
                        Crear Consulta
                    </Button>
                </form>
            </ContentLayout>
    );
}
