import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Role, type BreadcrumbItem } from '@/types';
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
        title: 'Listado de Roles',
        href: '/roles',
    },
];

export default function Index({ roles, filters }: { roles: Role[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('roles.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Roles" />
            <Heading
                title="Roles"
                description={`Administra los roles del sistema (${roles.length} encontrados).`}
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('roles.create')}>
                        Crear rol
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={roles}
            />
        </ContentLayout>
    );
}
