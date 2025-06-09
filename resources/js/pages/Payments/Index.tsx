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
        title: 'payments',
        href: '/payments',
    },
    
];

export default function Index({ payments }: { payments: any[] }) {

    // console.log('payments', payments);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />


            <ContentLayout>
                <Heading
                    title="payments"
                    description="Manage your payments"
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('payments.create')}>
                            Create Service
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={payments}
                />

            </ContentLayout>

        </AppLayout>
    );
}
