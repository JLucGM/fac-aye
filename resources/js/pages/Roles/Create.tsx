import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import RolesForm from './RolesForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function Create({permissions}:any) {
    const { data, setData, errors, post } = useForm({
        name: '', // Asegúrate de que sea string
        permissions: [], // Asegúrate de que sea string
    });
// console.log(data)
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('roles.store'), {
            onSuccess: () => {
                console.log("Metodo de pago creado con éxito:", data);
                // toast("Metodo de pago creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el Metodo de pago:", err);
                // toast("Error al crear el Metodo de pago.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Rol" />

            <ContentLayout>
                <Heading
                    title="Crear Rol"
                    description="Aquí puedes crear un nuevo rol."
                />

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <RolesForm
                        data={data}
                        permissions={permissions}
                        setData={setData}
                        errors={errors}
                    />

                    <Button
                        variant={"default"}
                    >
                        Crear Rol
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
