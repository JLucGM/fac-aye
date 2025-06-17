import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Consultation, PaymentMethod, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import PatientsForm from '../Patients/PatientsForm';
import ConsultationsForm from '../Consultations/ConsultationsForm';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'consultations',
        href: '/consultations',
    },
];


export default function Index({ users, services, paymentMethods }: {
    users: User[],
    services: Service[],
    paymentMethods: PaymentMethod[],
}) {

    const { data, setData, errors, post } = useForm({
        // datos del paciente
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',

        // datos de la consulta
        user_id: users[0].id,
        // patient_id: patients[0].id,
        service_id: [],
        status: '',
        scheduled_at: '',
        consultation_type: '', // Uncomment if you want to include consultation type
        // completed_at: '',
        notes: '',
        payment_status: '',
        amount: 0,

        // datos del pago
        // patient_id: null, // Agrega esta línea para inicializar patient_id
        // consultation_ids: [],
        payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null, // Cambia a null si no hay métodos de pago
        // amount: 0,
        // status: 'earring',
        reference: '',
        // notes: '',
        paid_at: new Date().toISOString().split('T')[0],

    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(data)
        e.preventDefault();
        post(route('module-operation.first_visit_store'), {
            onSuccess: () => {
                console.log("Paciente creado con éxito:", data);
                // toast("Paciente creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
                // toast("Error al crear el paciente.");
            },
        });
    };

    const paymentMethodOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.name
    }));

    // console.log('consultations', consultations);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />


            <ContentLayout>
                <Heading
                    title="Primera visita"
                    description="Gestión de primera visita"
                >
                    {/* <Button asChild>
                        <Link className="btn btn-primary" href={route('consultations.create')}>
                            Create paciente
                        </Link>
                    </Button> */}
                </Heading>

                <form className="flex flex-col gap-4" onSubmit={submit}>

                    <h1 className='text-xl'>paciente</h1>
                    <PatientsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <h1 className='text-xl'>consulta</h1>
                    <ConsultationsForm
                        data={data}
                        // patients={patients}
                        users={users}
                        services={services}
                        setData={setData}
                        errors={errors}
                    />

                    <h1 className='text-xl'>pago</h1>
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

                    <Button variant={"default"}>
                        Create Payment
                    </Button>

                </form>

            </ContentLayout>

        </AppLayout>
    );
}
