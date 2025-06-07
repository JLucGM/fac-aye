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
        title: 'Consultations',
        href: '/consultations',
    },
];

export default function Index({ consultations }: { consultations: any[] }) {

    console.log('consultations', consultations);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                consultations index
            </div> */}
            <ContentLayout>

                <Heading
                    title="Consultations"
                    description="Manage your consultations"
                >
                    <Link className="btn btn-primary" href="/consultations/create">
                        Create Consultation
                    </Link>
                </Heading>

                <div className="flex flex-col gap-4">
                    {consultations.length > 0 ? (
                        consultations.map((consultation) => (
                            <div key={consultation.id} className="card">
                                <h3 className="card-title">{consultation.title}</h3>
                                <p className="card-description">{consultation.description}</p>
                            </div>
                        ))
                    ) : (
                        <PlaceholderPattern />
                    )}
                </div>
            </ContentLayout>
        </AppLayout>
    );
}
