import Heading from '@/components/heading';
import { buttonVariants } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Módulo Operativo" />
            <Heading
                title="Módulo Operativo"
                description="Gestiona las operaciones del módulo."
            >

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
                    Búsqueda rápida de paciente
                </Link>

                <Link
                    className={buttonVariants({ variant: "link" })}
                    href={route('subscriptionpatient.store')}
                >
                    Actualizar funcional
                </Link>

                {/* <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('services.index')}
                    >
                        Servicios
                    </Link> */}
            </div>

        </ContentLayout>

        // </AppLayout>
    );
}
