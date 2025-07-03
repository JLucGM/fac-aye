import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Consultation, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { ContentLayout } from '@/layouts/content-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Módulo Operativo',
        href: '/module-operation',
    },
];

export default function Index({ }: {}) {

    // console.log('consultations', consultations);
    return (
        // <AppLayout breadcrumbs={breadcrumbs}>
        
        <ContentLayout breadcrumbs={breadcrumbs}>
                <Head title="Módulo Operativo" />
                <Heading
                    title="Módulo Operativo"
                    description="Gestiona las operaciones del módulo."
                >
                    {/* <Button asChild>
                        <Link className="btn btn-primary" href={route('consultations.create')}>
                            Create paciente
                        </Link>
                        </Button> */}
                </Heading>

                <div className="flex flex-col">

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('module-operation.first_visit_index')}
                    >
                        Primera visita
                    </Link>

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('consultations.create')}
                    >
                        Registro de asistencia
                    </Link>

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('module-operation.profile_patient_index')}
                    >
                        Consulta de paciente
                    </Link>

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('services.index')}
                    >
                        Servicios
                    </Link>
                </div>

            </ContentLayout>

        // </AppLayout>
    );
}
