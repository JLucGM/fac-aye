import Heading from '@/components/heading';
import { buttonVariants } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Modulo asistencia" />
            <Heading
                title="Modulo asistencia"
                description="Gestiona las operaciones de asistencia."
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
                    href={route('consultations.index')}
                >
                    Lista de Asistencias
                </Link>

                <Link
                    className={buttonVariants({ variant: "link" })}
                    href={route('patients.index')}
                >
                    Lista de Pacientes
                </Link>

            </div>

            {/*<Link
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
                </Link> */}


        </ContentLayout>

        // </AppLayout>
    );
}
