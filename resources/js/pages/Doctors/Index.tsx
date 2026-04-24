import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { DoctorResource, PaginatedData, type BreadcrumbItem } from '@/types';
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
        title: 'Doctores',
        href: '/doctors',
    },
];

interface IndexProps {
    doctors: PaginatedData<DoctorResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ doctors, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('doctors.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Doctores" />
            <Heading
                title="Doctores"
                description="Gestiona los especialistas de tu clínica."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild>
                        <Link href={route('doctors.create')}>
                            Crear doctor
                        </Link>
                    </Button>
                </div>
            </Heading>

            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={doctors.data}
                    meta={doctors.meta}
                    onSearch={setSearch}
                    initialSearch={search}
                    searchPlaceholder="Buscar por nombre o identificación..."
                />
            </div>
        </ContentLayout>
    );
}
