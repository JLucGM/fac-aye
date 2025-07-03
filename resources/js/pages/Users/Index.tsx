import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Lista de Usuarios',
        href: '/usuarios',
    },

];

export default function Index({ users }: { users: any }) {

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Lista de Usuarios" />
            <Heading
                title="Usuarios"
                description="Manage your users here"
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('user.create')}>
                        Crear usuarios
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={users}
            />

        </ContentLayout>
    );
}
