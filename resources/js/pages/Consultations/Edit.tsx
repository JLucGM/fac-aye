import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Consultation, Patient, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConsultationsForm from './ConsultationsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Consultations', // Changed breadcrumb to reflect consultations
        href: '/consultations', // Changed href to reflect consultations
    },
    {
        title: 'Edit Consultation', // Changed title for clarity
        href: '#',
    },
];

export default function Edit({ consultation, patients, users, services }: { consultation: Consultation, patients: Patient[], users: User[], services: Service[] }) {
    console.log("Edit consultation page loaded with consultation data:", consultation);
    const { data, setData, errors, put } = useForm({
        user_id: consultation.user_id,
        patient_id: consultation.patient_id,
        // Safely access 'consultation.services' using optional chaining (?) and provide an empty array (?? [])
        // if it's undefined or null, then map to extract service IDs.
        service_id: consultation.services?.map((service: Service) => service.id) ?? [],
        status: consultation.status,
        scheduled_at: consultation.scheduled_at ? new Date(consultation.scheduled_at).toISOString().slice(0, 16) : '',
        notes: consultation.notes || '',
        payment_status: consultation.payment_status || '',
        consultation_type: consultation.consultation_type || '',
        amount: consultation.amount || 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form data before submission:", data);

        // To resolve the 'Argument of type 'Router' is not assignable to parameter of type 'string'.' error,
        // we explicitly cast 'window.route' to 'any' to inform TypeScript about its correct usage as a function.
        // This is a common workaround when global functions from libraries like Ziggy are not fully type-declared.
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        // Ensure the correct consultation ID is passed for the update route.
        put(routeFn('consultations.update', consultation.id), {
            onSuccess: () => {
                console.log("Consulta actualizada con éxito:", data);
                // Optionally add a success toast notification here, e.g., toast("Consulta actualizada con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar la consulta:", err);
                // Optionally add an error toast notification here, e.g., toast("Error al actualizar la consulta.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Consultation" /> {/* Updated head title for clarity */}

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
                        Update Consultation {/* Changed button text for clarity */}
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}