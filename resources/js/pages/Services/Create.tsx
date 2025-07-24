import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ServicesForm from './ServicesForm';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Servicios',
        href: '/services',
    },
    {
        title: 'Crear Servicio',
        href: '/services/create',
    },
];

export default function Create() {
    const { data, setData, errors, post } = useForm({
        name: '',
        description: '',
        price: 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('services.store'), {
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al crear el servicio:", err);
            },
        });
    };

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Servicio" />
            <Heading
                title="Crear Servicio"
                description="Aquí puedes crear un nuevo servicio."
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <ServicesForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button
                    variant={"default"}
                >
                    Crear Servicio
                </Button>
            </form>
        </ContentLayout>
        // </AppLayout>
    );
}
