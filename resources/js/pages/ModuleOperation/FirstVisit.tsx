import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Doctor, Service, Subscription, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import PatientsForm from '../Patients/PatientsForm';
import ConsultationsForm from '../Consultations/ConsultationsForm';
import { Label } from '@/components/ui/label';
import Select from 'react-select'
import InputError from '@/components/input-error';

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

export default function Index({ users, services, doctors, subscriptions }: {
    users: User[],
    services: Service[],
    doctors: Doctor[],
    subscriptions: Subscription[],
}) {
    const { data, setData, errors, post } = useForm({
        // Datos del nuevo usuario
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',
        address: '', // Asegúrate de que este campo esté incluido si es necesario
        doctor_id: doctors.length > 0 ? doctors[0].id : null, // Default to the first doctor if available

        // Datos de la asistencia
        user_id: users.length > 0 ? users[0].id : 0, // Asegúrate de que user_id tenga un valor numérico
        service_id: [],
        status: 'programado' as 'programado', // Asegúrate de que este valor sea uno de los permitidos
        scheduled_at: new Date().toISOString().slice(0, 19),
        consultation_type: 'consultorio' as 'consultorio', // Asegúrate de que este valor sea uno de los permitidos
        notes: '',
        payment_status: 'pendiente' as 'pendiente', // Asegúrate de que este valor sea uno de los permitidos
        amount: 0,

        // Datos de la funcional
        subscription_id: '', // Inicializa el campo de funcional
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('module-operation.first_visit_store'), {
            onSuccess: () => {
                // Manejar el éxito
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
            },
        });
    };

    const subscriptionUseOptions = [
        { value: 'no', label: 'No usar funcional' },
        { value: 'yes', label: 'Usar funcional' }
    ];

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Primera Visita" />
            <Heading
                title="Primera visita"
                description="Gestión de primera visita"
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h1 className='text-xl col-span-full'>Información del Paciente</h1>
                    <PatientsForm
                        data={data}
                        subscriptions={subscriptions}
                        doctors={doctors}
                        setData={setData}
                        errors={errors}
                    />
                </div>

                <div className="mt-4">
                    <Label htmlFor="subscription_use" className="block font-semibold text-gray-700">¿Usar funcional?</Label>
                    <Select
                        id="subscription_use"
                        options={subscriptionUseOptions}
                        value={subscriptionUseOptions.find(option => option.value === data.subscription_use) || null}
                        onChange={(selected) => setData('subscription_use', selected?.value || 'no')}
                        isSearchable
                        className="mt-1"
                    />
                    <InputError message={errors.subscription_use} className="mt-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h1 className='text-xl col-span-full'>Información de la Consulta</h1>
                    <ConsultationsForm
                        data={data}
                        users={users}
                        patients={[]} // No se selecciona un paciente aquí
                        services={services}
                        setData={setData}
                        errors={errors}
                    />
                </div>

                <Button variant={"default"}>
                    Crear Primera Visita
                </Button>
            </form>
        </ContentLayout>
    );
}
