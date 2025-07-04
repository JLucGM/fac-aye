import { ContentLayout } from '@/layouts/content-layout';
import { Doctor, Patient, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PatientsForm from './DoctorsForm';
import Heading from '@/components/heading';
import DoctorsForm from './DoctorsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Doctores',
        href: '/doctors',
    },
    {
        title: 'Editar Doctor', // Updated title for clarity
        href: '#',
    },
];

export default function Edit({ doctor }: { doctor: Doctor }) {
    console.log("Edit doctor page loaded with doctor data:", doctor);
    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: doctor.name,
        lastname: doctor.lastname ?? '', // Fix: Provide an empty string if lastname is undefined
        email: doctor.email,
        phone: doctor.phone ?? '',       // Fix: Provide an empty string if phone is undefined
        identification: doctor.identification,
        specialty: doctor.specialty ?? '', // Fix: Provide an empty string if specialty is undefined
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('doctors.update', doctor), {
            onSuccess: () => {
                // console.log("Doctor actualizado con éxito:");
                // toast("Doctor actualizado con éxito."); // Uncomment if you have sonner setup
            },
            onError: (err) => {
                console.error("Error al actualizar el doctor:", err);
                // toast("Error al actualizar el doctor."); // Uncomment if you have sonner setup
            },
        });
    };

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Doctor" /> {/* Updated Head title */}
            <Heading
                title="Editar Doctor" // Updated heading title for clarity
                description="Aquí puedes editar la información de un doctor existente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <DoctorsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Actualizar Doctor
                </Button>
            </form>
        </ContentLayout>
        // </AppLayout>
    );
}