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
        title: 'Payment Methods',
        href: '/payment-methods',
    },
    {
        title: 'Edit',
        href: '/payment-methods/edit',
    },
];

export default function Edit({paymentMethod}: { paymentMethod: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                PaymentMethods edit
            </div>
        </AppLayout>
    );
}
