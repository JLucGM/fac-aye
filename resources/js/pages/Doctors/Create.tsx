import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
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
        title: 'Crear Doctor',
        href: '#',
    },
];

export default function Create() {
    const { data, setData, errors, post } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        identification: '',
        specialty: '',

    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('doctors.store'), {
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al crear el doctor:", err);
            },
        });
    };

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Doctor" />
            <Heading
                title="Crear Doctor"
                description="Aquí puedes crear un nuevo doctor."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <DoctorsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button
                    variant={"default"}
                >
                    Crear Doctor
                </Button>
            </form>
        </ContentLayout>
        // </AppLayout>
    );
}
