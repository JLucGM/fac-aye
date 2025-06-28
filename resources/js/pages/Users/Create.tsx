import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import RolesForm from './UsersForm';
import Heading from '@/components/heading';
import UsersForm from './UsersForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Lista de Usuarios',
        href: '/user',
    },
    {
        title: 'Crear Usuario',
        href: '#',
    },
];

export default function Create() {

    const { data, setData, errors, post } = useForm({
        name: '', // Asegúrate de que sea string
        lastname: '', // Asegúrate de que sea string
        email: '', // Asegúrate de que sea string
        active: false, // Asegúrate de que sea booleano
        phone: '',
        password: '',
        identification: '', // Asegúrate de que sea string
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('user.store'), {
            onSuccess: () => {
                console.log("Usuario creado con éxito:", data);
                // toast("Usuario creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el Usuario:", err);
                // toast("Error al crear el Usuario.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />

            <ContentLayout>
                <Heading
                    title="Crear Usuario"
                    description="Aquí puedes crear un nuevo usuario."
                />

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <UsersForm
                        data={data}
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
