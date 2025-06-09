import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Service, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ServicesForm from './ServicesForm';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Services',
        href: '/services',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ service }: { service: Service }) {

    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: service.name,
        description: service.description,
        price: service.price,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
                console.log(data); // Verifica que los datos se están actualizando

        put(route('services.update', service.id), {
            onSuccess: () => {
                console.log("Servicio actualizado con éxito:", data);
                // toast("Servicio actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el servicio:", err);
                // toast("Error al actualizar el servicio.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <ContentLayout>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <ServicesForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Update Service
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}

