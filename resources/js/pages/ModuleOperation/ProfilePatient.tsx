import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import ContentLayout from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'paciente',
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
    const calculateTotals = (consultations) => {
        const totalConsultations = consultations.length;
        const paidConsultations = consultations.filter(c => c.payment_status === 'paid').length;
        const pendingConsultations = totalConsultations - paidConsultations;

        return { totalConsultations, paidConsultations, pendingConsultations };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />

            <ContentLayout>
                <Heading
                    title="Consultations"
                    description="Manage your consultations"
                />
                <Input 
                    type="text" 
                    placeholder="Buscar por nombre, correo o identificación..." 
                    value={searchTerm}
                    onChange={handleSearch}
                />

                {filteredPatient ? (
                    <div className="mt-4">
                        <h2>Información del Paciente</h2>
                        <p><strong>Nombre:</strong> {filteredPatient.fullName}</p>
                        <p><strong>Email:</strong> {filteredPatient.email}</p>
                        <p><strong>Identificación:</strong> {filteredPatient.identification}</p>
                        <p><strong>Teléfono:</strong> {filteredPatient.phone}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {new Date(filteredPatient.birthdate).toLocaleDateString()}</p>

                        <h3>Consultas</h3>
                        <ul>
                            {filteredPatient.consultations.map(consultation => (
                                <li key={consultation.id}>
                                    {consultation.scheduled_at}: {consultation.notes} - Estado de Pago: {consultation.payment_status}
                                </li>
                            ))}
                        </ul>

                        {/* Mostrar totales */}
                        <div className="mt-4">
                            {filteredPatient.consultations.length > 0 && (
                                <>
                                    <p><strong>Total de Consultas:</strong> {calculateTotals(filteredPatient.consultations).totalConsultations}</p>
                                    <p><strong>Consultas Pagadas:</strong> {calculateTotals(filteredPatient.consultations).paidConsultations}</p>
                                    <p><strong>Consultas No Pagadas:</strong> {calculateTotals(filteredPatient.consultations).pendingConsultations}</p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    searchTerm && (
                        <div className="mt-4">
                            <p>No se encontraron resultados para "{searchTerm}".</p>
                        </div>
                    )
                )}
            </ContentLayout>
        </AppLayout>
    );
}
