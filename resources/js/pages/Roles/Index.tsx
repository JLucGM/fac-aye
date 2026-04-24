import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { RoleResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
        title: 'Roles',
        href: '/roles',
    },
];

interface IndexProps {
    roles: PaginatedData<RoleResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ roles, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('roles.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <Heading
                title="Roles"
                description="Gestiona los roles y permisos del sistema."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('roles.create')}>
                            Crear rol
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={roles.data}
                    meta={roles.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por nombre..."
                />
            </div>
        </ContentLayout>
    );
}
