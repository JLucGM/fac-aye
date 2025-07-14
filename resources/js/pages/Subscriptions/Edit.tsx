import { ContentLayout } from '@/layouts/content-layout';
import { Service, ServiceFormData, Subscription, SuscriptionFormData, type BreadcrumbItem } from '@/types'; // Asegúrate de importar SuscriptionFormData
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
        title: 'Editar Funcional',
        href: '#',
    },
];

export default function Edit({ subscription }: { subscription: Subscription }) {
    // Cambia el tipo a SuscriptionFormData
    const { data, setData, errors, put } = useForm<SuscriptionFormData>({
        name: subscription.name,
        description: subscription.description ?? '',
        price: subscription.price,
        type: subscription.type as 'semanal' | 'mensual' | 'anual', // Asegúrate de que el tipo sea correcto
        consultations_allowed: subscription.consultations_allowed ?? 0, // Asegúrate de que este campo esté presente
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('subscriptions.update', subscription), { // Asegúrate de pasar el ID correcto
            onSuccess: () => {
                // Manejo de éxito
            },
            onError: (err) => {
                console.error("Error al actualizar la Funcional:", err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Funcional" />
            <Heading
                title="Editar Funcional"
                description="Aquí puedes editar una Funcional existente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <SuscriptionsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Actualizar Funcionales
                </Button>
            </form>
        </ContentLayout>
    );
}
