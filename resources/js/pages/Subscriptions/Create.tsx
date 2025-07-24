import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import SuscriptionsForm from './SuscriptionsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Funcionales',
        href: '/subscriptions',
    },
    {
        title: 'Crear Funcional',
        href: '/subscriptions/create',
    },
];

export default function Create() {
    const { data, setData, errors, post } = useForm({
        name: '',
        description: '',
        price: 0,
        type: 'semanal' as 'semanal', // Asegúrate de que sea uno de los tipos permitidos
        consultations_allowed: 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('subscriptions.store'), {
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al crear la Funcional:", err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Funcional" />
            <Heading
                title="Crear Funcional"
                description="Aquí puedes crear una nueva Funcional."
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <SuscriptionsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Crear Funcional
                </Button>
            </form>
        </ContentLayout>
    );
}
