import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PatientsForm from './PatientsForm';

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

export default function Edit({ patient }: { patient: any }) {
console.log("Edit patient page loaded with patient data:", patient);
    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: patient.name,
        lastname: patient.lastname,
        email: patient.email,
        phone: patient.phone,
        birthdate: patient.birthdate.split('T')[0], // Extraer solo la fecha
        identification: patient.identification,

    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data); // Verifica que los datos se están actualizando

        put(route('patients.update', patient), {
            onSuccess: () => {
                console.log("Paciente actualizado con éxito:", data);
                // toast("Paciente actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el paciente:", err);
                // toast("Error al actualizar el paciente.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <ContentLayout>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PatientsForm
                        data={data}
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

