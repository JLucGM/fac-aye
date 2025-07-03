import { Button, buttonVariants } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex items-center justify-between">
                <p className='text-xl'><strong>Bienvenido,</strong> {auth.user.name} {auth.user.lastname}</p>

                {/* <div className="flex gap-4">
                    <Button variant="default" onClick={handleCierreDelDia}>
                        <Timer className="mr-2" />
                        Cierre de asistencia del día
                    </Button>
                    <Button variant="default" onClick={handlePagoDelDia}>
                        <Timer className="mr-2" />
                        Cierre de Pagos del día
                    </Button>
                </div> */}
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/*<div className="col-span-full">
                             <h1>Modulo operativo</h1> 
                        </div>*/}
                    <Link
                        className={'h-24 font-bold text-xl ' + buttonVariants({ variant: "outline" })}
                        href={route('module-operation.index')}
                    >
                        Modulo operativo
                    </Link>
                    {/* <Link
                            className={buttonVariants({ variant: "outline" })}
                            href={route('module-operation.first_visit_index')}
                        >
                            Primera visita
                        </Link>
                        <Link
                            className={buttonVariants({ variant: "outline" })}
                            href={route('module-operation.profile_patient_index')}
                        >
                            Búsqueda rápida de paciente
                        </Link> */}
                    {/* <div className="col-span-full">
                            <h1>Modulo asistencia</h1>
                        </div> */}
                    <Link
                        className={'h-24 font-bold text-xl ' + buttonVariants({ variant: "outline" })}
                        href={route('module-assistance.index')}
                    >
                        Modulo asistencia
                    </Link>
                    {/* <Link
                            className={buttonVariants({ variant: "outline" })}
                            href={route('patients.index')}
                        >
                            Lista de paciente
                        </Link> */}
                    {/* <div className="col-span-full">
                            <h1>Modulo administrativo</h1>
                        </div> */}

                    <Link
                        className={'h-24 font-bold text-xl ' + buttonVariants({ variant: "outline" })}
                        href={route('module-administrative.index')}
                    >
                        Modulo administrativo
                    </Link>

                    {/* <Link
                            className={buttonVariants({ variant: "outline" })}
                            href={route('payments.index')}
                        >
                            Listo de Pagos
                        </Link>
                        <Link
                            className={buttonVariants({ variant: "outline" })}
                            href={route('module-operation.accounts_receivable_index')}
                        >
                            Cuentas por cobrar
                        </Link> */}
                    {/* <Link

                            className={buttonVariants({ variant: "default" })}
                            href={route('payments.accounts-payable')}
                        >
                            Cuentas por pagar
                        </Link> */}
                    {/* <Link
                            className={buttonVariants({ variant: "default" })}
                            href={route('settings.index')}
                        >
                            Configuraciones generales
                        </Link> */}
                    {/* <Link
                            className={buttonVariants({ variant: "default" })}
                            href={route('users.index')}
                        >
                            Usuarios
                        </Link>
                        <Link
                            className={buttonVariants({ variant: "default" })}
                            href={route('patients.create')}
                        >
                            Registrar paciente
                        </Link> */}
                </div>
            </div>
        </ContentLayout>
        // </AppLayout>
    );
}
