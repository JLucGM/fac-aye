import Heading from '@/components/heading';
import {ContentLayout} from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem, Consultation } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import PatientInfo from '@/components/patients-info';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Búsqueda rápida paciente',
        href: '/module-operation.profile_patient_index',
    },
];

export default function ProfilePatient({ patients }: { patients: Patient[] }) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPatient, setFilteredPatient] = useState<Patient | null>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        const foundPatient = patients.find(patient =>
            patient.name.toLowerCase().includes(value.toLowerCase()) ||
            patient.email.toLowerCase().includes(value.toLowerCase()) ||
            patient.identification.includes(value)
        );

        setFilteredPatient(foundPatient || null);
    };

    // Calcular totales
    const calculateTotals = (consultations: Consultation[]): { totalConsultations: number; paidConsultations: number; pendingConsultations: number } => {
        const totalConsultations = consultations.length;
        const paidConsultations = consultations.filter(c => c.payment_status === 'pagado').length;
        const pendingConsultations = totalConsultations - paidConsultations;

        return { totalConsultations, paidConsultations, pendingConsultations };
    };

    // Definir las columnas para el DataTable
    const columns: ColumnDef<Consultation>[] = [
        {
            accessorKey: 'scheduled_at',
            header: 'Fecha Programada',
            cell: ({ row }) => new Date(row.original.scheduled_at).toLocaleString(),
        },
        {
            accessorKey: 'status',
            header: 'Estado',
        },
        {
            accessorKey: 'payment_status',
            header: 'Estado de Pago',
        },
        {
            accessorKey: 'amount',
            header: 'Monto',
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.edit', [row.original.id])}>
                        Editar
                    </Link>
                );
            },
        },
    ];

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

            <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Búsqueda rápida paciente" />

                <Heading
                    title="Búsqueda rápida paciente"
                    description="Aquí puedes buscar un paciente por nombre, correo o identificación y ver sus asistencias."
                />
                
                <Input
                    type="text"
                    placeholder="Buscar por nombre, correo o identificación..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

                {filteredPatient ? (
                    <div className="mt-4">
                        <div className="flex justify-end">
                            <Link className={buttonVariants({ variant: 'outline' }) + ' w-auto'} href={route('patients.show', [filteredPatient.slug ?? filteredPatient.id])}>
                                <Eye /> Perfil del paciente
                            </Link>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="">
                                <PatientInfo patient={filteredPatient} />
                            </div>

                            {/* Mostrar totales */}
                            <div className="mt-4">
                                {filteredPatient.consultations && filteredPatient.consultations.length > 0 && (
                                    <>
                                        <p>Total de asistencias: {calculateTotals(filteredPatient.consultations).totalConsultations}</p>
                                        <p>Asistencias Pagadas: {calculateTotals(filteredPatient.consultations).paidConsultations}</p>
                                        <p>Asistencias No Pagadas: {calculateTotals(filteredPatient.consultations).pendingConsultations}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Usar el DataTable para mostrar las consultas */}
                        <DataTable columns={columns} data={filteredPatient.consultations || []} />
                    </div>
                ) : (
                    searchTerm && (
                        <div className="mt-4">
                            <p>No se encontraron resultados para "{searchTerm}".</p>
                        </div>
                    )
                )}
            </ContentLayout>
        // </AppLayout>
    );
}
