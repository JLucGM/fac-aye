import { ContentLayout } from '@/layouts/content-layout';
import { Service, ServiceFormData, type BreadcrumbItem } from '@/types'; // Import ServiceFormData
import { Head, useForm } from '@inertiajs/react';
import ServicesForm from './ServicesForm';
import { Button } from '@/components/ui/button';
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
        title: 'Editar Servicio', // Updated title for clarity
        href: '#',
    },
];

export default function Edit({ service }: { service: Service }) {

    // IMPORTANT FIX: Explicitly use ServiceFormData as the type argument for useForm
    const { data, setData, errors, put, recentlySuccessful } = useForm<ServiceFormData>({
        name: service.name,
        // Provide an empty string if description is undefined to match ServiceFormData's string type
        description: service.description ?? '',
        price: service.price,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('services.update', service), { // Use routeFn and pass service.id
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al actualizar el servicio:", err);
            },
        });
    };

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Servicio" /> {/* Updated Head title */}
            <Heading
                title="Editar Servicio"
                description="Aquí puedes editar un servicio existente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <ServicesForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Actualizar Servicio
                </Button>
            </form>
        </ContentLayout>
        // </AppLayout>
    );
}