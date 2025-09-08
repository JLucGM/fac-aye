import { CreateConsultationFormData, Patient, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import ConsultationsForm from './ConsultationsForm';
import Heading from '@/components/heading';
import { useEffect, useState } from 'react';

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
        status: 'completado',
        // scheduled_at: new Date().toISOString().slice(0, 19),
        consultation_type: 'consultorio',
        notes: '',
        payment_status: 'pendiente', // Inicialmente se establece como pendiente
        amount: 0,
                subscription_use: 'no', // <-- inicializar aquí

    });

    const [birthdayPatients, setBirthdayPatients] = useState<Patient[]>([]);
    
        useEffect(() => {
            const today = new Date().toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
            const birthdayList = patients.filter(patient => {
                if (patient.birthdate) {
                    const birthday = new Date(patient.birthdate).toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
                    return birthday === today;
                }
                return false; // Si birthdate es undefined, no incluir en la lista
            });
            setBirthdayPatients(birthdayList);
        }, [patients]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('consultations.store'), {
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al crear la Asistencia:", err);
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

            {/* Mostrar mensaje o tabla de pacientes que cumplen años */}
            {birthdayPatients.length > 0 && (
                <div className="mb-4 p-4 border border-yellow-300 bg-yellow-100 rounded">
                    <h2 className="font-semibold text-lg">¡Feliz Cumpleaños a nuestros pacientes!</h2>
                    <ul>
                        {birthdayPatients.map(patient => (
                            <li key={patient.id}>
                                {patient.name} {patient.lastname} - {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('es-CA', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Fecha no disponible'}
                            </li>
                        ))}

                    </ul>
                </div>
            )}

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
