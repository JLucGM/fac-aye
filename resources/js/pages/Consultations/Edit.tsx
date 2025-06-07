import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
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
        title: 'Edit',
        href: '/consultations/edit',
    },
];

export default function Edit({consultation}: { consultation: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                consultations edit
            </div>
        </AppLayout>
    );
}
