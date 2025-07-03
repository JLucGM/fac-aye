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
        title: 'Listado de Pacientes',
        href: '/patients',
    },
];

export default function Index({ patients }: { patients: Patient[] }) {

    // console.log('patients', patients);
    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

            <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Pacientes" />
                <Heading
                    title="Listado de Pacientes"
                    description="Gestiona tus pacientes."
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('patients.create')}>
                            Crear paciente
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={patients}
                />

            </ContentLayout>

        // </AppLayout>
    );
}
