import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, PaymentMethod, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import PatientsForm from '../Patients/PatientsForm';
import ConsultationsForm from '../Consultations/ConsultationsForm';
import { add } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Primera Visita',
        href: '#',
    },
];

export default function Index({ users, services }: {
    users: User[],
    services: Service[],
    // paymentMethods: PaymentMethod[],
}) {

    const { data, setData, errors, post } = useForm({
        // datos del paciente
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',
        address: '', // Asegúrate de que este campo esté incluido si es necesario
        
        // datos de la asistencia
        user_id: users[0].id,
        service_id: [],
        status: 'programado' as 'programado' | 'confirmado' | 'completado' | 'cancelado' | '', // Asegúrate de que este valor sea uno de los permitidos
        scheduled_at: new Date().toISOString().slice(0, 19),
        consultation_type: 'consultorio' as 'consultorio' | 'domiciliaria' | '', // Asegúrate de que este valor sea uno de los permitidos
        notes: '',
        payment_status: 'pendiente', // Asegúrate de que este valor sea uno de los permitidos
        amount: 0,

        // payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null,
        // reference: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('module-operation.first_visit_store'), {
            onSuccess: () => {
                // console.log("Paciente creado con éxito:", data);
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
            },
        });
    };

    // const paymentMethodOptions = paymentMethods.map(method => ({
    //     value: method.id,
    //     label: method.name
    // }));

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Primera Visita" />
            <Heading
                title="Primera visita"
                description="Gestión de primera visita"
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                        <h1 className='text-xl col-span-full'>Información del Paciente</h1>
                        <PatientsForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>

                    <div className="">
                        <h1 className='text-xl'>Información de la Consulta</h1>

                        <ConsultationsForm
                            data={data}
                            users={users}
                            patients={[]}
                            services={services}
                            setData={setData}
                            errors={errors}
                        />

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
                    </div>
                </div>

                <Button variant={"default"}>
                    Crear Primera Visita
                </Button>
            </form>
        </ContentLayout>
        // </AppLayout>
    );
}
