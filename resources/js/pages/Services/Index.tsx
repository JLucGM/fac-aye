import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Service, type BreadcrumbItem } from '@/types';
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
        title: 'Listado de Servicios',
        href: '/services',
    },
];

export default function Index({ services, filters }: { services: Service[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('services.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Servicios" />
            <Heading
                title="Servicios"
                description={`Administra tus servicios (${services.length} encontrados).`}
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('services.create')}>
                        Crear servicio
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={services}
            />
        </ContentLayout>
    );
}
