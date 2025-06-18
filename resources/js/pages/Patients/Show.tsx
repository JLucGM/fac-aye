import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem, Consultation } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { consultationColumns } from './consultationColumns';
import { PenBox } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'patients',
        href: '/patients',
    },
    {
        title: 'Ver',
        href: '#',
    },
];

const calculateAge = (birthdate: string | undefined): number | string => {
    if (!birthdate) return 'Fecha no disponible'; // Manejo de caso donde no hay fecha
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Ajustar la edad si el cumpleaños no ha ocurrido aún este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

const calculateTotalDebt = (consultations: Consultation[]): number => {
    return consultations
        .filter(consultation => consultation.payment_status === 'pending') // Filtrar consultas pendientes
        .reduce((total, consultation) => total + (typeof consultation.amount === 'string' ? parseFloat(consultation.amount) : consultation.amount), 0); // Sumar los montos
};

export default function Show({ patient }: { patient: Patient }) {
    console.log('paciente', patient);

    // Contar total de consultas, pagadas y no pagadas
    const totalConsultations = patient.consultations?.length || 0;
    const paidConsultations = patient.consultations?.filter(consultation => consultation.payment_status === 'paid').length || 0;
    const pendingConsultations = patient.consultations?.filter(consultation => consultation.payment_status === 'pending').length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ver Paciente" />

            <ContentLayout>
                <Heading
                    title={`${patient.name} ${patient.lastname}`}
                    description="Detalles del paciente"
                >
                    <Button asChild>
                        <Link className="btn btn-primary" href={route('patients.edit',[patient])}>
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
                        <p><strong>Edad:</strong> {calculateAge(patient.birthdate)}</p> {/* Cálculo de edad aquí */}
                    </div>

                    <div className="flex flex-col">
                        <p><strong>Total de Consultas:</strong> {totalConsultations}</p>
                        <p><strong>Consultas Pagadas:</strong> {paidConsultations}</p>
                        <p><strong>Consultas Pendientes:</strong> {pendingConsultations}</p>
                        <p><strong>Total de Deuda:</strong> ${calculateTotalDebt(patient.consultations || []).toFixed(2)}</p> {/* Cálculo de deuda aquí */}
                    </div>
                </div>

                <div className="mt-4">
                    <h2>Consultas</h2>
                    <DataTable
                        columns={consultationColumns}
                        data={patient.consultations || []} // Asegúrate de pasar un array, incluso si está vacío
                    />
                </div>
            </ContentLayout>
        </AppLayout>
    );
}
