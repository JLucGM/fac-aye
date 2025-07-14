import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Service, Subscription, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Funcionales',
        href: '/subscriptions',
    },
];

export default function Index({ subscriptions }: { subscriptions: Subscription[] }) {

    // console.log('subscriptions', subscriptions);
    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Funcionales" />
            <Heading
                title="Funcionales"
                description="Administra tus Funcionales aquí."
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('subscriptions.create')}>
                        Crear Funcional
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={subscriptions}
            />

        </ContentLayout>

        // </AppLayout>
    );
}
