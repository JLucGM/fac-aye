import { buttonVariants } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div> */}
                    <div className="col-span-full">
                        <h1 >Modulo operativo</h1>
                    </div>
                    <Link
                        className={buttonVariants({ variant: "default" })}
                        href={route('module-operation.first_visit_index')}
                    >
                        Primera visita
                    </Link>

                    {/* <Link
                        className={buttonVariants({ variant: "default" })}
                        href={route('payments.create')}
                    >
                        Registrar pago
                    </Link> */}
                    <Link
                        className={buttonVariants({ variant: "default" })}
                        href={route('module-operation.profile_patient_index')}
                    >
                        Búsqueda rápida de paciente
                    </Link>
                    <div className="col-span-full">
                        <h1 >Modulo asistencia</h1>
                    </div>
                    <Link
                        className={buttonVariants({ variant: "default" })}
                        href={route('patients.index')}
                    >
                        lista de paciente
                    </Link>
                    <div className="col-span-full">
                        <h1 >Modulo administrativo</h1>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
