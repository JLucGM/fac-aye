import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem, Consultation, PatientSubscription } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { consultationColumns } from './consultationColumns';
import { ChevronsDown, ChevronsUp, PenBox } from 'lucide-react';
import React, { useState, useMemo } from 'react'; // Importamos useMemo
import { format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleTrigger, CollapsibleContent, } from "@/components/ui/collapsible";
import { subscriptionColumns } from './subscriptionColumns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ConsultationPDF from '@/components/pdf/ConsultationPdf';
import { MedicalRecordTimeline } from '@/components/MedicalRecordTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeadingSmall from '@/components/heading-small';

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

/**
 * Calcula la edad del paciente a partir de su fecha de nacimiento.
 * @param birthdate La fecha de nacimiento del paciente en formato string.
 * @returns La edad del paciente como número, o 'Fecha no disponible' si no se proporciona.
 */
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

/**
 * Calcula la deuda total de las consultas pendientes.
 * @param consultations Un array de objetos Consultation.
 * @returns La suma de los montos de las consultas con estado 'pendiente'.
 */
const calculateTotalDebt = (consultations: Consultation[]): number => {
    return consultations
        .filter(consultation => consultation.payment_status === 'pendiente')
        .reduce((total, consultation) => total + (typeof consultation.amount === 'string' ? parseFloat(consultation.amount) : consultation.amount), 0);
};

export default function Show({ patient, subscriptions, settings }: { patient: Patient, subscriptions: PatientSubscription[], settings: any[] }) {
console.log(patient)
    const logoUrl = settings.media.find(media => media.collection_name === 'logo')?.original_url || null;
    const signatureUrl = settings.media.find(media => media.collection_name === 'signature')?.original_url || null;

    const [paymentStatus, setPaymentStatus] = useState<string>('all');
    const [consultationType, setConsultationType] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Estado para controlar el colapso
    const [filterBySubscription, setFilterBySubscription] = useState<boolean>(false); // Nuevo estado para filtrar por suscripción

    const consultations = patient.consultations || [];

    // Determinar si hay una suscripción activa
    const activeSubscription = subscriptions.find(subscription =>
        subscription.status === 'active' &&
        new Date(subscription.start_date) <= new Date() &&
        new Date(subscription.end_date) >= new Date()
    );

    /**
     * Filtra las consultas basándose en los criterios seleccionados por el usuario.
     * Se usa useMemo para memorizar el resultado y evitar cálculos innecesarios.
     */
    const filteredConsultations = useMemo(() => {
        return consultations.filter(consultation => {
            const paymentMatch = paymentStatus === 'all' || consultation.payment_status === paymentStatus;
            const typeMatch = consultationType === 'all' || consultation.consultation_type === consultationType;

            let subscriptionMatch = true;
            if (filterBySubscription) {
                subscriptionMatch = consultation.patient_subscription_id !== null;
            }

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

            return paymentMatch && typeMatch && subscriptionMatch && dateMatch;
        });
    }, [consultations, paymentStatus, consultationType, filterBySubscription, startDate, endDate]);

    const pdfKey = JSON.stringify(filteredConsultations.map(c => c.id));

    const totalConsultations = filteredConsultations.length;
    const paidConsultations = filteredConsultations.filter(consultation => consultation.payment_status === 'pagado').length;
    const pendingConsultations = filteredConsultations.filter(consultation => consultation.payment_status === 'pendiente').length;

    return (
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
                    <h2 className="text-xl font-bold">Información del Paciente</h2>
                    <p>Nombre: {patient.name} {patient.lastname}</p>
                    <p>Email: {patient.email}</p>
                    <p>Identificación: {patient.identification}</p>
                    <p>Teléfono: {patient.phone}</p>
                    <p>Fecha de Nacimiento: {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('es-ES') : 'Fecha no disponible'}</p>
                    <p>Edad: {calculateAge(patient.birthdate)}</p>
                    <p>Dirección: {patient.address || 'No disponible'}</p>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">Información general de asistencia</h2>
                    <p>Total de Asistencias: {totalConsultations}</p>
                    <p>Asistencias Pagadas: {paidConsultations}</p>
                    <p>Asistencias Pendientes: {pendingConsultations}</p>
                    <p>Total de Deuda: ${calculateTotalDebt(consultations).toFixed(2)}</p>
                </div>

                <div className="mt-4">
                    <h2 className="text-xl font-bold">Información de funcional</h2>
                    <p>Funcional Activa: {activeSubscription ? 'Sí' : 'No'}</p>
                    {activeSubscription && (
                        <>
                            <p>Inicio del periodo: {new Date(activeSubscription.start_date).toLocaleDateString('es-ES')}</p>
                            <p>Final del periodo: {new Date(activeSubscription.end_date).toLocaleDateString('es-ES')}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 space-y-4">
                <div className="mt-4">

                    <Tabs defaultValue="account" className="w-full">
                        <TabsList>
                            <TabsTrigger value="account">Consultas</TabsTrigger>
                            <TabsTrigger value="password">Funcionales</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
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
                                    <option value="pagado">Pagadas</option>
                                    <option value="pendiente">Pendientes</option>
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
                                    <option value="domiciliaria">Domiciliaria</option>
                                    <option value="consultorio">Consultorio</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Label htmlFor="filterBySubscription" className="whitespace-nowrap">Filtrar por Funcional:</Label>
                                <input
                                    type="checkbox"
                                    id="filterBySubscription"
                                    checked={filterBySubscription}
                                    onChange={(e) => setFilterBySubscription(e.target.checked)}
                                />
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
                                    setFilterBySubscription(false); // Limpiar el filtro de suscripción
                                }}
                                variant={'outline'}
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                    <div className="flex justify-between">

                        <HeadingSmall
                                title='Consultas'
                                description="Lista de consultas del paciente"
                            />
                        <Button asChild>
                            <PDFDownloadLink
                                key={pdfKey} // Se añadió la clave para forzar el re-renderizado
                                document={
                                    <ConsultationPDF
                                        consultations={filteredConsultations}
                                        patient={patient}
                                        settings={settings}
                                        logoUrl={logoUrl}
                                        signatureUrl={signatureUrl}
                                    />
                                }
                                fileName={`reporte_consultas_${patient.id}.pdf`}
                            >
                                {({ loading }) => (loading ? 'Cargando documento...' : 'PDF Informe de Asistencia')}
                            </PDFDownloadLink>
                        </Button>
                    </div>

                            <DataTable
                                columns={consultationColumns}
                                data={filteredConsultations}
                            />
                        </TabsContent>
                        <TabsContent value="password">
                            <HeadingSmall
                                title="Funcionales"
                                description="Lista de suscripciones activas y pasadas del paciente"
                            />
            
                            <DataTable
                                columns={subscriptionColumns}
                                data={subscriptions}
                            />

                        </TabsContent>
                    </Tabs>

                </div>
            </div>


            <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Historial Médico</h2>
                <MedicalRecordTimeline
                    medicalRecords={patient.medical_records || []}
                    initialVisibleCount={3}
                // onEdit={openMedicalRecordDialog} // Pasar la función para abrir el diálogo
                />
            </div>


        </ContentLayout>
    );
}