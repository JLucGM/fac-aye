import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { SubscriptionResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
        title: 'Planes funcionales',
        href: '/subscriptions',
    },
];

interface IndexProps {
    subscriptions: PaginatedData<SubscriptionResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ subscriptions, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('subscriptions.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes funcionales" />
            <Heading
                title="Planes funcionales"
                description="Gestiona tus planes funcionales (suscripciones)."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('subscriptions.create')}>
                            Crear plan funcional
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={subscriptions.data}
                    meta={subscriptions.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por nombre..."
                />
            </div>
        </ContentLayout>
    );
}
