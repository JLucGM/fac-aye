import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ContentLayout } from '@/layouts/content-layout';
import { PaymentMethod, Role, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Roles',
        href: '/roles',
    },

];

export default function Index({ roles }: { roles: Role[] }) {
    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            <Heading
                title="roles"
                description="Manage your roles"
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('roles.create')}>
                        Create roles
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={roles}
            />

        </ContentLayout>
    );
}
