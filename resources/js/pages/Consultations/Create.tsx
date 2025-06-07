import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Consultations',
        href: '/consultations',
    },
    {
        title: 'Create',
        href: '/consultations/create',
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />

            <ContentLayout>
            
            </ContentLayout>
        </AppLayout>
    );
}
