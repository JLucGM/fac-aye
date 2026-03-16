import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { Doctor, type BreadcrumbItem } from '@/types';
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
        title: 'Listado de Doctores',
        href: '/doctors',
    },
];

export default function Index({ doctors, filters }: { doctors: Doctor[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('doctors.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Doctores" />
            <Heading
                title="Listado de Doctores"
                description={`Gestiona tus doctores (${doctors.length} encontrados).`}
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('doctors.create')}>
                        Crear doctor
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={doctors}
            />
        </ContentLayout>
    );
}
