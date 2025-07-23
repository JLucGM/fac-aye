import { Consultation, CreateConsultationFormData, Patient, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ContentLayout } from '@/layouts/content-layout';
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
}) {
    const { data, setData, errors, post } = useForm<CreateConsultationFormData>({
        user_id: users[0].id,
        patient_id: patients[0].id,
        service_id: [],
        status: 'programado',
        scheduled_at: new Date().toISOString().slice(0, 19),
        consultation_type: 'consultorio',
        notes: '',
        payment_status: 'pendiente', // Inicialmente se establece como pendiente
        amount: 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Verificar si el paciente tiene una suscripción activa
        const currentPatient = patients.find(patient => patient.id === data.patient_id);
        const hasActiveSubscription = currentPatient?.subscriptions?.some(sub => sub.status === 'active');

        // Si hay una suscripción activa, establecer el estado de pago como "pagado"
        if (hasActiveSubscription) {
            setData('payment_status', 'pagado');
        }

        post(route('consultations.store'), {
            onSuccess: () => {
                toast.success("Consulta creada con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear la Asistencia:", err);
                toast.error("Error al crear la asistencia.");
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Asistencia" />
            <Heading
                title="Crear asistencia"
                description="Aquí puedes crear una nueva asistencia para un paciente."
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Button variant={"default"}>
                    Crear Consulta
                </Button>
            </form>
        </ContentLayout>
    );
}
