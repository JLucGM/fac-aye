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
        title: 'Payments',
        href: '/payments',
    },
];

export default function Index({paymentMethods}: { paymentMethods: any[] }) {

    console.log('paymentMethods', paymentMethods);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                Payment index
            </div>
        </AppLayout>
    );
}
