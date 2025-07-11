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
        title: 'Listado de suscripciones',
        href: '/subscriptions',
    },
    {
        title: 'Crear Suscripción',
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
                // console.log("Suscripción creada con éxito:", data);
            },
            onError: (err) => {
                console.error("Error al crear la suscripción:", err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Suscripción" />
            <Heading
                title="Crear Suscripción"
                description="Aquí puedes crear una nueva suscripción."
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <SuscriptionsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Crear Suscripción
                </Button>
            </form>
        </ContentLayout>
    );
}
