import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { PaymentMethod, Role, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'usuarios',
        href: '/usuarios',
    },

];

export default function Index({ users }: { users: any }) {

    // console.log('paymentMethods', paymentMethods);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lista de Usuarios" />

            <ContentLayout>
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

        </AppLayout>
    );
}
