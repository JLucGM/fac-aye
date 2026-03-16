import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Subscription, type BreadcrumbItem } from '@/types';
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
        title: 'Listado de Funcionales',
        href: '/subscriptions',
    },
];

export default function Index({ subscriptions, filters }: { subscriptions: Subscription[], filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('subscriptions.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Funcionales" />
            <Heading
                title="Funcionales"
                description={`Administra tus Funcionales (${subscriptions.length} encontrados).`}
            >
                <Button asChild>
                    <Link className="btn btn-primary" href={route('subscriptions.create')}>
                        Crear Funcional
                    </Link>
                </Button>
            </Heading>

            <DataTable
                columns={columns}
                data={subscriptions}
            />
        </ContentLayout>
    );
}
