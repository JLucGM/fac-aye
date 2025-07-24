import { ContentLayout } from '@/layouts/content-layout';
import { Doctor, Patient, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
        title: 'Editar Paciente',
        href: '#',
    },
];

export default function Edit({ patient, doctors, subscriptions }: { patient: Patient, doctors: Doctor[], subscriptions: Subscription[] }) {
    // Obtener la última suscripción activa
    const activeSubscription = patient.subscriptions?.find(sub => sub.status === 'active') || null;

    const { data, setData, errors, put } = useForm({
        name: patient.name,
        lastname: patient.lastname ?? '',
        email: patient.email,
        phone: patient.phone ?? '',
        birthdate: patient.birthdate ? patient.birthdate.split('T')[0] : '',
        identification: patient.identification,
        address: patient.address ?? '',
        doctor_id: patient.doctor_id ?? null,
        subscription_id: activeSubscription ? activeSubscription.subscription_id : null, // Obtener la última suscripción activa
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('patients.update', patient), {
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al actualizar el paciente:", err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Paciente" />
            <Heading
                title="Editar Paciente"
                description="Aquí puedes editar un paciente existente."
            />
            {/* {errors && Object.keys(errors).length > 0 && (
                <div className="text-red-500">
                    {Object.keys(errors).map((key) => (
                        <p key={key}>{errors[key]}</p>
                    ))}
                </div>
            )} */}

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <PatientsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    doctors={doctors}
                    subscriptions={subscriptions} // Pasar la lista de suscripciones
                />

                <Button variant={"default"}>
                    Actualizar Paciente
                </Button>
            </form>
        </ContentLayout>
    );
}
