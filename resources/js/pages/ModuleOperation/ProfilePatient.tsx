import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
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

export default function ProfilePatient({ patients = [] }: { patients?: Patient[] }) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPatient, setFilteredPatient] = useState<Patient | null>(null);

    console.log('patients:', patients); // Verifica el valor de patients

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (Array.isArray(patients)) {
            const foundPatient = patients.find(patient => 
                patient.name.toLowerCase().includes(value.toLowerCase()) ||
                patient.email.toLowerCase().includes(value.toLowerCase()) ||
                patient.identification.includes(value)
            );

            setFilteredPatient(foundPatient || null);
        } else {
            console.error("patients is not an array:", patients);
            setFilteredPatient(null);
        }
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
                        <p><strong>Nombre:</strong> {filteredPatient.name} {filteredPatient.lastname}</p>
                        <p><strong>Email:</strong> {filteredPatient.email}</p>
                        <p><strong>Identificación:</strong> {filteredPatient.identification}</p>
                        <p><strong>Teléfono:</strong> {filteredPatient.phone}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {new Date(filteredPatient.birthdate).toLocaleDateString()}</p>
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
