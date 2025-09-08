import Heading from '@/components/heading';
import { buttonVariants } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Módulo asistencia',
        href: '/consultations',
    },
];

export default function Index({ }: {}) {

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Módulo asistencia" />
            <Heading
                title="Módulo asistencia"
                description="Gestiona las operaciones de asistencia."
            >
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
        </ContentLayout>
    );
}
