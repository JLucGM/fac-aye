import Heading from '@/components/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContentLayout } from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Banknote, FileStack, FileText, ReceiptText, Timer, CalendarRange, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Módulo administrativo',
        href: '/module-administrative',
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
            <Head title="Módulo administrativo" />
            <div className="space-y-6">
                <Heading
                    title="Módulo administrativo"
                    description="Gestiona las operaciones financieras, facturación y reportes de cierre."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gestión Financiera Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-muted-foreground" />
                                Gestión Financiera
                            </CardTitle>
                            <CardDescription>
                                Acceso rápido a pagos, cuentas y facturación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-muted-foreground font-normal">Registro central de ingresos</Label>
                                <Link
                                    className={buttonVariants({ variant: "outline", className: "justify-start" })}
                                    href={route('payments.index')}
                                >
                                    <FileStack className="mr-2 h-4 w-4" />
                                    Registros de Pagos
                                </Link>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-muted-foreground font-normal">Pendientes de cobro</Label>
                                <Link
                                    className={buttonVariants({ variant: "outline", className: "justify-start" })}
                                    href={route('module-operation.accounts_receivable_index')}
                                >
                                    <ReceiptText className="mr-2 h-4 w-4" />
                                    Cuentas por cobrar
                                </Link>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-muted-foreground font-normal">Documentación legal</Label>
                                <Link
                                    className={buttonVariants({ variant: "outline", className: "justify-start" })}
                                    href={route('invoices.index')}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Gestión de Facturas
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reportes y Cierres Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Timer className="h-5 w-5 text-muted-foreground" />
                                Reportes y Cierres
                            </CardTitle>
                            <CardDescription>
                                Genera reportes de asistencia y pagos del día o rangos específicos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button variant="default" onClick={handleCierreDelDia} className="w-full">
                                    <Timer className="mr-2 h-4 w-4" />
                                    Asistencia del Día
                                </Button>
                                <Button variant="default" onClick={handlePagoDelDia} className="w-full">
                                    <Banknote className="mr-2 h-4 w-4" />
                                    Pagos del Día
                                </Button>
                            </div>

                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <CalendarRange className="h-4 w-4" />
                                    Consulta por rango de fechas
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="startDate">Desde</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="endDate">Hasta</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <Button
                                        variant="secondary"
                                        onClick={handleCierrePorRango}
                                        disabled={!startDate || !endDate}
                                        className="w-full"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Asistencia Rango
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handlePagoPorRango}
                                        disabled={!startDate || !endDate}
                                        className="w-full"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Pagos Rango
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ContentLayout>
    );
};

export default Index;
