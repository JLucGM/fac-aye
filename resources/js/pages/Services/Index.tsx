import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Service, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Services',
        href: '/services',
    },
];

export default function Index({ services }: { services: Service[] }) {

    // console.log('services', services);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Servicios" />

            <ContentLayout>
                <Heading
                    title="Servicios"
                    description="Administra tus servicios"
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('services.create')}>
                            Crear servicio
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={services}
                />

            </ContentLayout>

        </AppLayout>
    );
}
