import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Facturas',
        href: '/invoices',
    },
];

export default function Index({ invoices }: { invoices: any[] }) {

    // console.log('invoices', invoices);
    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

            <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Facturas" />
                <Heading
                    title="Listado de Facturas"
                    description="Gestiona tus Facturas de manera eficiente."
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('invoices.create')}>
                            Crear factura
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={invoices}
                />

            </ContentLayout>

        // </AppLayout>
    );
}
