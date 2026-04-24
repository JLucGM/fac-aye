import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { ServiceResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
        title: 'Servicios',
        href: '/services',
    },
];

interface IndexProps {
    services: PaginatedData<ServiceResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ services, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('services.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios" />
            <Heading
                title="Servicios"
                description="Gestiona los servicios y tratamientos ofrecidos."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('services.create')}>
                            Crear servicio
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={services.data}
                    meta={services.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por nombre..."
                />
            </div>
        </ContentLayout>
    );
}
