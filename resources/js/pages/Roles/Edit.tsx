import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Role, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import RolesForm from './RolesForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Role', href: '/roles' },
    { title: 'Edit role', href: '#' },
];

export default function Edit({ role, permissions, assignedPermissions }: { role: Role; permissions: { name: string }[]; assignedPermissions: string[] }) {
    const { data, setData, errors, put } = useForm({
        name: role.name || '',
        permissions: assignedPermissions || [], // Aquí pasan los nombres de permisos asignados directamente
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('roles.update', role), {
            onSuccess: () => {
                console.log('Role actualizado con éxito:', data);
            },
            onError: (err) => {
                console.error('Error al actualizar el Role:', err);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Rol" />

            <ContentLayout>
                <Heading
                    title="Editar Rol"
                    description="Aquí puedes editar un rol existente."
                />
                
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <RolesForm
                        data={data}
                        permissions={permissions}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant="default">Actualizar rol</Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
