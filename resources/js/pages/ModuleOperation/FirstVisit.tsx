import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Doctor, Service, Subscription, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import PatientsForm from '../Patients/PatientsForm';
import ConsultationsForm from '../Consultations/ConsultationsForm';

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
        status: 'completado', // Asegúrate de que este valor sea uno de los permitidos
        // scheduled_at: new Date().toISOString().slice(0, 19),
        consultation_type: 'consultorio', // Asegúrate de que este valor sea uno de los permitidos
        notes: '',
        payment_status: 'pendiente', // Asegúrate de que este valor sea uno de los permitidos
        amount: 0,

        // Datos de la funcional
        subscription_id: '', // Inicializa el campo de funcional
        subscription_use: 'no', // Nuevo campo para controlar si usa funcional
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
    const selectedSubscription = subscriptions.find(s => s.id === data.subscription_id) || null;

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Primera Visita" />
            <Heading
                title="Primera visita"
                description="Gestión de primera visita"
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h1 className='text-xl '> Información del Paciente</h1>
                    <PatientsForm
                        data={data}
                        subscriptions={subscriptions}
                        doctors={doctors}
                        setData={setData}
                        errors={errors}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h1 className='text-xl col-span-full'>Información de la Asistencia</h1>
                    <ConsultationsForm
                        data={data}
                        users={users}
                        patients={[]} // No se selecciona un paciente aquí
                        services={services}
                        setData={setData}
                        errors={errors}
                        activeSubscription={selectedSubscription} // <-- Aquí
                    />
                </div>

                <Button variant={"default"}>
                    Crear Primera Visita
                </Button>
            </form>
        </ContentLayout>
    );

}
