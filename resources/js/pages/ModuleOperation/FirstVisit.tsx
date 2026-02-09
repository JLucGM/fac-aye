import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Doctor, Service, Subscription, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import PatientsForm from '../Patients/PatientsForm';
import ConsultationsForm from '../Consultations/ConsultationsForm';
import { useState } from 'react';
import { ConfirmFirstVisitDialog } from '@/components/ConfirmFirstVisitDialog'; // Ajusta la ruta según tu estructura

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
    const { data, setData, errors, post, processing } = useForm({
        // Datos del nuevo usuario
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',
        address: '',
        doctor_id: doctors.length > 0 ? doctors[0].id : null,

        // Datos de la asistencia
        user_id: users.length > 0 ? users[0].id : 0,
        service_id: [],
        status: 'completado',
        consultation_type: 'consultorio',
        notes: '',
        payment_status: 'pendiente',
        amount: 0,

        // Datos de la funcional
        subscription_id: '',
        subscription_use: 'no',
    });

    // Estado para controlar el diálogo de confirmación
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Mostrar diálogo de confirmación en lugar de enviar directamente
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmFirstVisit = () => {
        post(route('module-operation.first_visit_store'), {
            onSuccess: () => {
                setIsConfirmDialogOpen(false);
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
                setIsConfirmDialogOpen(false);
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
                    <h1 className='text-xl col-span-full'> Información del Paciente</h1>
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
                        patients={[]}
                        services={services}
                        setData={setData}
                        errors={errors}
                        activeSubscription={selectedSubscription}
                    />
                </div>

                <Button variant={"default"} disabled={processing}>
                    {processing ? 'Creando...' : 'Crear Primera Visita'}
                </Button>
            </form>

            {/* Diálogo de confirmación para la primera visita */}
            <ConfirmFirstVisitDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                onConfirm={handleConfirmFirstVisit}
                title="Confirmar Primera Visita"
                description="Por favor, revisa los datos antes de crear el nuevo paciente y su primera consulta."
                confirmButtonText="Confirmar y Crear"
                processing={processing}
                patientData={{
                    name: data.name,
                    lastname: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    birthdate: data.birthdate,
                    identification: data.identification,
                    address: data.address,
                    doctor_id: data.doctor_id,
                    subscription_id: data.subscription_id,
                }}
                consultationData={{
                    user_id: data.user_id,
                    service_id: data.service_id,
                    status: data.status,
                    consultation_type: data.consultation_type,
                    notes: data.notes,
                    payment_status: data.payment_status,
                    amount: data.amount,
                    subscription_use: data.subscription_use,
                }}
                users={users}
                services={services}
                doctors={doctors}
                subscriptions={subscriptions}
            />
        </ContentLayout>
    );
}