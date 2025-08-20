import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Pacientes',
        href: '/patients',
    },
];

export default function Index({ patients }: { patients: Patient[] }) {
    const [birthdayPatients, setBirthdayPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
        const birthdayList = patients.filter(patient => {
            if (patient.birthdate) {
                const birthday = new Date(patient.birthdate).toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
                return birthday === today;
            }
            return false; // Si birthdate es undefined, no incluir en la lista
        });
        setBirthdayPatients(birthdayList);
    }, [patients]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Pacientes" />
            <Heading
                title="Listado de Pacientes"
                description="Gestiona tus pacientes."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild variant={'outline'}>
                        <Link href={route('subscriptionpatient.store')}>
                            Actualizar funcional
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={route('patients.create')}>
                            Crear paciente
                        </Link>
                    </Button>
                </div>
            </Heading>

            {/* Mostrar mensaje o tabla de pacientes que cumplen años */}
            {birthdayPatients.length > 0 && (
                <div className="mb-4 p-4 border border-yellow-300 bg-yellow-100 rounded">
                    <h2 className="font-semibold text-lg">¡Feliz Cumpleaños a nuestros pacientes!</h2>
                    <ul>
                        {birthdayPatients.map(patient => (
                            <li key={patient.id}>
                                {patient.name} {patient.lastname} - {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('en-CA', { day: '2-digit', month: '2-digit' }) : 'Fecha no disponible'}
                            </li>
                        ))}

                    </ul>
                </div>
            )}

            <DataTable
                columns={columns}
                data={patients}
            />
        </ContentLayout>
    );
}
