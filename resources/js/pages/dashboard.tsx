import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { Timer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const { post } = useForm(); // Cambiar a post para descargar el PDF

    const handleCierreDelDia = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open(route('cierre.del.dia'), '_blank'); // Abre en una nueva pestaña
    };
    
    const handlePagoDelDia = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open(route('pagos.del.dia'), '_blank'); // Abre en una nueva pestaña
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <ContentLayout>
                <div className="flex items-center justify-between">
                    <p className='text-xl'><strong>Bienvenido,</strong> {auth.user.name} {auth.user.lastname}</p>
                
                <div className="flex gap-4">
                    <Button variant="default" onClick={handleCierreDelDia}>
                        <Timer className="mr-2" />
                        Cierre de asistencia del día
                    </Button>
                    <Button variant="default" onClick={handlePagoDelDia}>
                        <Timer className="mr-2" />
                        Cierre de Pagos del día
                    </Button>
                </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="col-span-full">
                            <h1>Modulo operativo</h1>
                        </div>
                        <Link
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
                        </Link>
                        <div className="col-span-full">
                            <h1>Modulo asistencia</h1>
                        </div>
                        <Link
                            className={buttonVariants({ variant: "outline" })}
                            href={route('patients.index')}
                        >
                            Lista de paciente
                        </Link>
                        <div className="col-span-full">
                            <h1>Modulo administrativo</h1>
                        </div>

                        <Link
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
                        </Link>
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
        </AppLayout>
    );
}
