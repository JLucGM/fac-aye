import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConsultationsForm from './ConsultationsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Patients',
        href: '/patients',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ consultation, patient, patients, users, services }: { consultation: any, patient: any, patients: any[], users: any[], services: any[] }) {   
    console.log("Edit consultation page loaded with consultation data:", consultation);
    const { data, setData, errors, put } = useForm({
        user_id: consultation.user_id,
        patient_id: consultation.patient_id,
        service_id: consultation.services.map((service: any) => service.id), // Extraer los IDs de los servicios
        status: consultation.status,
        scheduled_at: consultation.scheduled_at ? new Date(consultation.scheduled_at).toISOString().slice(0, 16) : '',
        notes: consultation.notes || '',
        payment_status: consultation.payment_status || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data); // Verifica que los datos se están actualizando

        put(route('consultations.update', consultation), {
            onSuccess: () => {
                console.log("Consulta actualizada con éxito:", data);
                // toast("Consulta actualizada con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar la consulta:", err);
                // toast("Error al actualizar la consulta.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <ContentLayout>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <ConsultationsForm
                        data={data}
                        patients={patients}
                        users={users}
                        services={services}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Update Patient
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}

