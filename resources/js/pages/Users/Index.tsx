import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { UserResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
        title: 'Listado de Usuarios',
        href: '/user',
    },
];

interface IndexProps {
    users: PaginatedData<UserResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ users, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('user.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Usuarios" />
            <Heading
                title="Listado de Usuarios"
                description="Gestiona los usuarios que tienen acceso al sistema."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('user.create')}>
                            Crear usuario
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={users.data}
                    meta={users.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por nombre, email o identificación..."
                />
            </div>
        </ContentLayout>
    );
}
