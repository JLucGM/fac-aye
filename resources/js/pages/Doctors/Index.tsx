import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { Doctor, Patient, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Doctores',
        href: '/doctors',
    },
];

export default function Index({ doctors }: { doctors: Doctor[] }) {

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

            <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Doctores" />
                <Heading
                    title="Listado de Doctores"
                    description="Gestiona tus doctores de manera eficiente."
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('doctors.create')}>
                            Crear doctor
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={doctors}
                />

            </ContentLayout>

        // </AppLayout>
    );
}
