import { Doctor, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import PatientsForm from './PatientsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Pacientes',
        href: '/patients',
    },
    {
        title: 'Crear Paciente',
        href: '#',
    },
];

export default function Create({ doctors, subscriptions }: { doctors: Doctor[], subscriptions: Subscription[] }) {
    const { data, setData, errors, post } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',
        address: '',
        doctor_id: doctors.length > 0 ? doctors[0].id : null,
        subscription_id: '', // Inicializa el campo de suscripción
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data); // Para depuración, puedes ver los datos que se envían
        post(route('patients.store'), {
            onSuccess: () => {
                // Manejo de éxito
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Paciente" />
            <Heading
                title="Crear Paciente"
                description="Aquí puedes crear un nuevo paciente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <PatientsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    doctors={doctors}
                    subscriptions={subscriptions} // Pasar la lista de suscripciones
                />

                <Button variant={"default"}>
                    Crear Paciente
                </Button>
            </form>
        </ContentLayout>
    );
}
