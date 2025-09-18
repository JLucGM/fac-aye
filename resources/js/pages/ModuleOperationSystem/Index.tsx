import Heading from '@/components/heading';
import { buttonVariants } from '@/components/ui/button';
import {  type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ContentLayout } from '@/layouts/content-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Módulo Operativo  del Sistema',
        href: '/module-operation',
    },
];

export default function Index({ }: {}) {

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>
        
        <ContentLayout breadcrumbs={breadcrumbs}>
                <Head title="Módulo Operativo del Sistema" />
                <Heading
                    title="Módulo Operativo"
                    description="Gestiona las operaciones del módulo de sistema."
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
                        href={route('patients.index')}
                    >
                        Pacientes
                    </Link>
                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('payment-methods.index')}
                    >
                        Métodos de pago
                    </Link>

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('services.index')}
                    >
                        Servicios
                    </Link>

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('doctors.index')}
                    >
                        Médico tratantes
                    </Link>

                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('subscriptions.index')}
                    >
                        Funcionales
                    </Link>
                    <Link
                        className={buttonVariants({ variant: "link" })}
                        href={route('user.index')}
                    >
                        Usuarios
                    </Link>
                </div>

            </ContentLayout>

        // </AppLayout>
    );
}
