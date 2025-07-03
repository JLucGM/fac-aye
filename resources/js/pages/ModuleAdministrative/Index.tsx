import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Timer } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Modulo administrativo',
        href: '/consultations',
    },
];

const Index = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleCierreDelDia = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open(route('cierre.del.dia'), '_blank');
    };

    const handlePagoDelDia = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open(route('pagos.del.dia'), '_blank');
    };

    const handleCierrePorRango = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        window.open(route('cierre.por.rango', { start: startDate, end: endDate }), '_blank');
    };

    const handlePagoPorRango = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        window.open(route('pagos.por.rango', { start: startDate, end: endDate }), '_blank');
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Modulo administrativo" />
            <Heading
                title="Modulo administrativo"
                description="Gestiona las operaciones administrativas."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">

                    <h3 className="font-medium">Cierres del día actual:</h3>

                    <Link
                        className={buttonVariants({ variant: "default" })}
                        href={route('payments.index')}
                    >
                        Registros de Pagos
                    </Link>
                    <h3 className="font-medium">Cierres del día actual:</h3>

                    <Link
                        className={buttonVariants({ variant: "default" })}
                        href={route('module-operation.accounts_receivable_index')}
                    >
                        Cuentas por cobrar
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-medium">Cierres del día actual:</h3>
                    <Button variant="default" onClick={handleCierreDelDia}>
                        <Timer className="mr-2" />
                        Cierre de asistencia del día
                    </Button>
                    <Button variant="default" onClick={handlePagoDelDia}>
                        <Timer className="mr-2" />
                        Cierre de Pagos del día
                    </Button>

                    <h3 className="font-medium">Cierres por rango de fechas:</h3>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded p-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <Button
                        variant="default"
                        onClick={handleCierrePorRango}
                        disabled={!startDate || !endDate}
                    >
                        <Timer className="mr-2" />
                        Cierre de asistencia por rango
                    </Button>
                    <Button
                        variant="default"
                        onClick={handlePagoPorRango}
                        disabled={!startDate || !endDate}
                    >
                        <Timer className="mr-2" />
                        Cierre de Pagos por rango
                    </Button>
                </div>
            </div>
        </ContentLayout>
    );
};

export default Index;
