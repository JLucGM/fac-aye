import Heading from '@/components/heading';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Services',
        href: '/services',
    },
];

export default function Index({services}: { services: any[] }) {

    console.log('services', services);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            

            <ContentLayout>
                <Heading
                    title="Services"
                    description="Manage your services"
                >
                    <Link className="btn btn-primary" href={route('services.create')}>
                        Create Service
                    </Link>
                </Heading>
                
                
            </ContentLayout>
           
        </AppLayout>
    );
}
