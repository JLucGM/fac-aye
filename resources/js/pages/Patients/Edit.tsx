import { ContentLayout } from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem } from '@/types';
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
        title: 'Editar Paciente', // Updated title for clarity
        href: '#',
    },
];

export default function Edit({ patient }: { patient: Patient }) {
    // console.log("Edit patient page loaded with patient data:", patient);
    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: patient.name,
        lastname: patient.lastname ?? '', // Fix: Provide an empty string if lastname is undefined
        email: patient.email,
        phone: patient.phone ?? '',       // Fix: Provide an empty string if phone is undefined
        birthdate: patient.birthdate ? patient.birthdate.split('T')[0] : '', // Extract only the date part
        identification: patient.identification,
        address: patient.address ?? '', // Fix: Provide an empty string if address is undefined
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('patients.update', patient), {
            onSuccess: () => {
                // console.log("Paciente actualizado con éxito:");
                // toast("Paciente actualizado con éxito."); // Uncomment if you have sonner setup
            },
            onError: (err) => {
                console.error("Error al actualizar el paciente:", err);
                // toast("Error al actualizar el paciente."); // Uncomment if you have sonner setup
            },
        });
    };

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Paciente" /> {/* Updated Head title */}
            <Heading
                title="Editar Paciente" // Updated heading title for clarity
                description="Aquí puedes editar la información de un paciente existente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <PatientsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Actualizar Paciente
                </Button>
            </form>
        </ContentLayout>
        // </AppLayout>
    );
}