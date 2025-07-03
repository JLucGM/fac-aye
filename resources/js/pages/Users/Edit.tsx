import {ContentLayout} from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import UsersForm from './UsersForm';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/dashboard' },
    { title: 'Lista de usuarios', href: '/user' },
    { title: 'Editar usuario', href: '#' },
];

export default function Edit({ user }: { user: any; }) {

    const { data, setData, errors, put } = useForm({
        name: user.name || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
        active: user.active || false,
        identification: user.identification || '', // Asegúrate de que sea string
        password: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('user.update', user), {
            onSuccess: () => {
                // console.log('Usuario actualizado con éxito:', data);
            },
            onError: (err) => {
                console.error('Error al actualizar el Usuario:', err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Usuario" />
            <Heading
                title="Editar Usuario"
                description="Aquí puedes editar un usuario existente."
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <UsersForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant="default">
                    Actualizar usuario
                </Button>
            </form>
        </ContentLayout>
    );
}
