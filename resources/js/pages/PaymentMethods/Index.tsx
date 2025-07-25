import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Métodos de Pago',
        href: '/paymentMethods',
    },

];

export default function Index({ paymentMethods }: { paymentMethods: PaymentMethod[] }) {

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Métodos de Pago" />
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
    );
}
