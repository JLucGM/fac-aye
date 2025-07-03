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
        // console.log("Submitting updated service data:", data); // Verifies that data is updating

        // FIX: Address 'Argument of type 'Router' is not assignable to parameter of type 'string'.'
        // This workaround helps TypeScript understand the global 'route' function (from Ziggy.js)
        // by explicitly casting 'window.route' to a function type that returns a string.
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('services.update', service), { // Use routeFn and pass service.id
            onSuccess: () => {
                // console.log("Servicio actualizado con éxito:", data);
                // toast("Servicio actualizado con éxito."); // Uncomment if you have sonner setup
            },
            onError: (err) => {
                console.error("Error al actualizar el servicio:", err);
                // toast("Error al actualizar el servicio."); // Uncomment if you have sonner setup
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