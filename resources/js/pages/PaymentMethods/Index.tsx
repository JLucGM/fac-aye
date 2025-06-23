import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'paymentMethods',
        href: '/paymentMethods',
    },

];

export default function Index({ paymentMethods }: { paymentMethods: PaymentMethod[] }) {

    // console.log('paymentMethods', paymentMethods);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Métodos de Pago" />

            <ContentLayout>
                <Heading
                    title="Listado de Métodos de Pago"
                    description="Gestiona tus métodos de pago."
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('payment-methods.create')}>
                            Crear Método de Pago
                        </Link>
                    </Button>
                </Heading>

                <DataTable
                    columns={columns}
                    data={paymentMethods}
                />

            </ContentLayout>

        </AppLayout>
    );
}
