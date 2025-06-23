import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import PatientsForm from './PatientsForm';
import Heading from '@/components/heading';

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
        title: 'Create',
        href: '#',
    },
];

export default function Create() {
    const { data, setData, errors, post } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('patients.store'), {
            onSuccess: () => {
                console.log("Paciente creado con éxito:", data);
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
            <Head title="Crear Paciente" />

            <ContentLayout>
                <Heading
                    title="Crear Paciente"
                    description="Aquí puedes crear un nuevo paciente."
                />
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PatientsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button
                        variant={"default"}
                    >
                        Crear Paciente
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
