import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PaymentMethodResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
        title: 'Métodos de pago',
        href: '/payment-methods',
    },
];

interface IndexProps {
    paymentMethods: PaginatedData<PaymentMethodResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ paymentMethods, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('payment-methods.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Métodos de pago" />
            <Heading
                title="Métodos de pago"
                description="Gestiona los métodos de pago aceptados en la clínica."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('payment-methods.create')}>
                            Crear método
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={paymentMethods.data}
                    meta={paymentMethods.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por nombre..."
                />
            </div>
        </ContentLayout>
    );
}
