import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Invoice, type BreadcrumbItem } from '@/types';
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
        title: 'Listado de Facturas',
        href: '/invoices',
    },
];

export default function Index({ invoices, filters }: { invoices: Invoice[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    // Sincronizar búsqueda con el servidor (Debounce 400ms)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('invoices.index'), { search }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Facturas" />
            <Heading
                title="Listado de Facturas"
                description={`Gestiona tus Facturas (${invoices.length} encontradas).`}
            >
                <div className="flex gap-4">
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('invoices.create')}>
                            Crear factura
                        </Link>
                    </Button>
                </div>
            </Heading>

            <DataTable
                columns={columns}
                data={invoices}
                // Si tu DataTable tiene un input de búsqueda, puedes pasarle 'search' y 'setSearch' 
                // o usar el que ya tiene si logras capturar su evento.
            />
        </ContentLayout>
    );
}
