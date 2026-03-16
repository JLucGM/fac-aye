import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import React, { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Métodos de Pago',
        href: '/payment-methods',
    },
];

export default function Index({ paymentMethods, filters }: { paymentMethods: PaymentMethod[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('payment-methods.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Métodos de Pago" />
            <Heading
                title="Métodos de Pago"
                description={`Administra los métodos de pago (${paymentMethods.length} encontrados).`}
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('payment-methods.create')}>
                        Crear método de pago
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
