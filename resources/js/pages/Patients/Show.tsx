import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem, Consultation } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { consultationColumns } from './consultationColumns';
import { ChevronsDown, ChevronsUp, PenBox } from 'lucide-react';
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible"; // Asegúrate de importar los componentes de colapso

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Pacientes',
        href: '/patients',
    },
    {
        title: 'Ver',
        href: '#',
    },
];

const calculateAge = (birthdate: string | undefined): number | string => {
    if (!birthdate) return 'Fecha no disponible';
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

const calculateTotalDebt = (consultations: Consultation[]): number => {
    return consultations
        .filter(consultation => consultation.payment_status === 'pending')
        .reduce((total, consultation) => total + (typeof consultation.amount === 'string' ? parseFloat(consultation.amount) : consultation.amount), 0);
};

export default function Show({ patient }: { patient: Patient }) {
    const [paymentStatus, setPaymentStatus] = useState<string>('all');
    const [consultationType, setConsultationType] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Estado para controlar el colapso

    const consultations = patient.consultations || [];

    const filteredConsultations = consultations.filter(consultation => {
        const paymentMatch = paymentStatus === 'all' || consultation.payment_status === paymentStatus;
        const typeMatch = consultationType === 'all' || consultation.consultation_type === consultationType;

        let dateMatch = true;
        if (startDate || endDate) {
            const consultationDate = parseISO(consultation.scheduled_at);
            const formattedConsultationDate = format(consultationDate, 'yyyy-MM-dd');

            if (startDate && endDate) {
                dateMatch = formattedConsultationDate >= startDate && formattedConsultationDate <= endDate;
            } else if (startDate) {
                dateMatch = formattedConsultationDate >= startDate;
            } else if (endDate) {
                dateMatch = formattedConsultationDate <= endDate;
            }
        }

        return paymentMatch && typeMatch && dateMatch;
    });

    const totalConsultations = filteredConsultations.length;
    const paidConsultations = filteredConsultations.filter(consultation => consultation.payment_status === 'paid').length;
    const pendingConsultations = filteredConsultations.filter(consultation => consultation.payment_status === 'pending').length;

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

            <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Ver Paciente" />
                <Heading
                    title={`${patient.name} ${patient.lastname}`}
                    description="Detalles del paciente"
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('patients.edit', [patient])}>
                            <PenBox />
                            Actualizar paciente
                        </Link>
                    </Button>
                </Heading>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mt-4">
                        <h2>Información del Paciente</h2>
                        <p><strong>Nombre:</strong> {patient.name} {patient.lastname}</p>
                        <p><strong>Email:</strong> {patient.email}</p>
                        <p><strong>Identificación:</strong> {patient.identification}</p>
                        <p><strong>Teléfono:</strong> {patient.phone}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('es-ES') : 'Fecha no disponible'}</p>
                        <p><strong>Edad:</strong> {calculateAge(patient.birthdate)}</p>
                        <p><strong>Dirección:</strong> {patient.address || 'No disponible'}</p>
                    </div>

                    <div className="flex flex-col">
                        <p><strong>Total de Consultas:</strong> {totalConsultations}</p>
                        <p><strong>Consultas Pagadas:</strong> {paidConsultations}</p>
                        <p><strong>Consultas Pendientes:</strong> {pendingConsultations}</p>
                        <p><strong>Total de Deuda:</strong> ${calculateTotalDebt(consultations).toFixed(2)}</p>
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    <h2 className="text-xl font-bold">Filtros de Consultas</h2>

                    <Collapsible
                        open={isFiltersOpen}
                        onOpenChange={setIsFiltersOpen}
                        className="w-full space-y-2"
                    >
                        <div className="flex items-center justify-between space-x-4 px-4 bg-gray-100 p-3 rounded-md">
                            <h4 className="text-sm font-semibold">
                                Filtros de Consulta
                            </h4>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    {isFiltersOpen ? (
                                        <>
                                            Ocultar filtros
                                            <ChevronsUp className="h-4 w-4 mr-2" />
                                        </>
                                    ) : (
                                        <>
                                            Mostrar filtros
                                            <ChevronsDown className="h-4 w-4 mr-2" />
                                        </>
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="paymentStatus" className="whitespace-nowrap">Estado de pago:</Label>
                                    <select
                                        id="paymentStatus"
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="border rounded p-2"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="paid">Pagadas</option>
                                        <option value="pending">Pendientes</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="consultationType" className="whitespace-nowrap">Tipo de consulta:</Label>
                                    <select
                                        id="consultationType"
                                        value={consultationType}
                                        onChange={(e) => setConsultationType(e.target.value)}
                                        className="border rounded p-2"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="domiciliary">Domicilio</option>
                                        <option value="office">Oficina</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="startDate">Desde:</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="endDate">Hasta:</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                    />
                                </div>

                                <Button
                                    onClick={() => {
                                        setPaymentStatus('all');
                                        setConsultationType('all');
                                        setStartDate('');
                                        setEndDate('');
                                    }}
                                    variant={'outline'}
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Consultas ({filteredConsultations.length})</h2>
                        <DataTable
                            columns={consultationColumns}
                            data={filteredConsultations}
                        />
                    </div>
                </div>
            </ContentLayout>
        // </AppLayout>
    );
}
