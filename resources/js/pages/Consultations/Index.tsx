import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'consultations',
        href: '/consultations',
    },
];

export default function Index({ consultations }: { consultations: any[] }) {

    // console.log('consultations', consultations);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />


            <ContentLayout>
                <Heading
                    title="consultations"
                    description="Manage your consultations"
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('consultations.create')}>
                            Create paciente
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={consultations}
                />

            </ContentLayout>

        </AppLayout>
    );
}
