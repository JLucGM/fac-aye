import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { type BreadcrumbItem, User } from '@/types';
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
        title: 'Lista de Usuarios',
        href: '/usuarios',
    },
];

export default function Index({ users, filters }: { users: User[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('user.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Lista de Usuarios" />
            <Heading
                title="Usuarios"
                description={`Gestiona tus usuarios (${Array.isArray(users) ? users.length : 0} encontrados).`}
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('user.create')}>
                        Crear usuarios
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={users}
            />
        </ContentLayout>
    );
}
