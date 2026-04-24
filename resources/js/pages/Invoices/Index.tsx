import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { InvoiceResource, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Facturas',
        href: '/invoices',
    },
];

interface IndexProps {
    invoices: PaginatedData<InvoiceResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ invoices, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('invoices.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Facturas" />
            <Heading
                title="Facturas"
                description="Gestiona las facturas de tus pacientes."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('invoices.create')}>
                            Crear Factura
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={invoices.data}
                    meta={invoices.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por número o paciente..."
                />
            </div>
        </ContentLayout>
    );
}
