import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Consultation, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'consultations',
        href: '/consultations',
    },
];

export default function Index({ }: {}) {

    // console.log('consultations', consultations);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />


            <ContentLayout>
                <Heading
                    title="consultations"
                    description="Manage your consultations"
                >
                    {/* <Button asChild>
                        <Link className="btn btn-primary" href={route('consultations.create')}>
                            Create paciente
                        </Link>
                        </Button> */}
                </Heading>

                <Link
                    className={buttonVariants({ variant: "default" })}
                    href={route('module-operation.first_visit_index')}
                >
                    Primera visita
                </Link>

                <Link
                    className={buttonVariants({ variant: "default" })}
                    href={route('payments.create')}
                >
                    registrar pago
                </Link>
                <Link
                    className={buttonVariants({ variant: "default" })}
                    href={route('module-operation.profile_patient_index')}
                >
                    datos de paciente
                </Link>


            </ContentLayout>

        </AppLayout>
    );
}
