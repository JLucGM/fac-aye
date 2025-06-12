import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Consultation, Patient, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import ConsultationsForm from './ConsultationsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Consultations',
        href: '/consultations',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function Create({ patients, users, services }: {
    patients: Patient[],
    users: User[],
    services: Service[],
}) {
    // console.log("Create consultation page loaded with patients:", patients);
    // console.log("Create consultation page loaded with users:", users);
    // console.log("Create consultation page loaded with services:", services);

    const { data, setData, errors, post } =  useForm<Consultation>({
        user_id: users[0].id,
        patient_id: patients[0].id,
        service_id: [],
        status: '',
        scheduled_at: '',
        consultation_type: '', // Uncomment if you want to include consultation type
        // completed_at: '',
        notes: '',
        payment_status: '',
        amount: 0,
    });
    // console.log("Create consultation page loaded with initial data:", data);
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        // console.log("Submitting consultation with data:", data);
        e.preventDefault();
        post(route('consultations.store'), {
            onSuccess: () => {
                // console.log("Paciente creado con éxito:", data);
                // toast("Paciente creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
                // toast("Error al crear el paciente.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />

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

                    <Button
                        variant={"default"}
                    >
                        Create Patient
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
