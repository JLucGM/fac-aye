import AppLayout from '@/layouts/app-layout';
import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, Patient, PaymentMethod, Service, User, MedicalRecord, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConsultationsForm from './ConsultationsForm';
import Heading from '@/components/heading';
import { Download } from 'lucide-react';
import MedicalRecordForm from './MedicalRecordForm';

// Importar los componentes de Dialog de shadcn/ui
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react'; // Necesitamos useState para controlar la apertura/cierre del modal
import { MedicalRecordTimeline } from '@/components/MedicalRecordTimeline';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/dashboard' },
    { title: 'Lista de asistencias', href: '/consultations' },
    { title: 'Editar asistencia', href: '#' },
];

export default function Edit({ consultation, patients, users, services, paymentMethods }: {
    consultation: Consultation & {
        payment?: Array<{
            id: number;
            payment_method_id: number;
            reference: string;
        }>;
        medical_records?: MedicalRecord[];
        patient: Patient; // Asegúrate de que patient esté tipado correctamente aquí
    },
    patients: Patient[],
    users: User[],
    services: Service[],
    paymentMethods: PaymentMethod[]
}) {
    // Estado para controlar la apertura/cierre del Dialog
    const [isMedicalRecordDialogOpen, setIsMedicalRecordDialogOpen] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

    // Formulario para la Consulta (existente)
    const { data, setData, errors, put } = useForm({
        user_id: consultation.user_id,
        patient_id: consultation.patient_id,
        service_id: consultation.services?.map((service: Service) => service.id) ?? [],
        status: consultation.status,
        // scheduled_at: consultation.scheduled_at ? new Date(consultation.scheduled_at).toISOString().slice(0, 16) : '',
        notes: consultation.notes || '',
        payment_status: consultation.payment_status || '',
        consultation_type: consultation.consultation_type || '',
        amount: consultation.amount || 0,
        subscription_use: consultation.patient_subscription_id ? 'yes' : 'no', // Determina si se usa la suscripción
    });

    const submitConsultation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(data);
        put(route('consultations.update', consultation.id)), {
            onSuccess: () => {
                toast.success('asistencia actualizada con éxito');
            },
            onError: (errors:any) => {
                console.error("Error al actualizar la asistencia:", errors);
            }
        };
    };

    // Formulario para crear o actualizar un MedicalRecord
    const { data: medicalRecordData, setData: setMedicalRecordData, errors: medicalRecordErrors, post: postMedicalRecord, put: updateMedicalRecord, reset: resetMedicalRecordForm, processing: medicalRecordProcessing } = useForm({
        patient_id: consultation.patient_id,
        consultation_id: consultation.id,
        title: '',
        anamnesis: '',
        pain_behavior: '',
        description: '',
        // record_date: new Date().toISOString().slice(0, 10),
        type: 'consulta',
    });

    const submitMedicalRecord = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedMedicalRecord) {
            // Actualizar el registro médico existente
            updateMedicalRecord(route('medical-records.update', selectedMedicalRecord.id), {
                onSuccess: () => {
                    resetMedicalRecordForm();
                    setIsMedicalRecordDialogOpen(false); // Cerrar el modal al éxito
                    window.location.reload(); // Recargar para ver el nuevo registro
                },
                onError: (errors) => {
                    console.error("Error al actualizar Medical Record:", errors);
                }
            });
        } else {
            // Crear un nuevo registro médico
            postMedicalRecord(route('medical-records.store'), {
                onSuccess: () => {
                    resetMedicalRecordForm();
                    setIsMedicalRecordDialogOpen(false); // Cerrar el modal al éxito
                    window.location.reload(); // Recargar para ver el nuevo registro
                },
                onError: (errors) => {
                    console.error("Error al crear Medical Record:", errors);
                }
            });
        }
    };

    const openMedicalRecordDialog = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setMedicalRecordData({
            patient_id: record.patient_id,
            consultation_id: record.consultation_id ?? 0, // Asignar un valor por defecto si es null
            title: record.title,
            anamnesis: record.anamnesis || '', // Asegúrate de que no sea null
            pain_behavior: record.pain_behavior || '', // Asegúrate de que no sea null
            description: record.description || '', // Asegúrate de que no sea null
            // record_date: record.record_date || new Date().toISOString().slice(0, 10), // Si no hay record_date, usar la fecha actual
            type: record.type,
        });
        setIsMedicalRecordDialogOpen(true);
    };


    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar asistencia ${consultation.id}`} />
            <Heading
                title={`Editar Asistencia`}
                description="Modifica los detalles de la asistencia y la información de pago."
            >
                <div className="">
                    <Dialog open={isMedicalRecordDialogOpen} onOpenChange={setIsMedicalRecordDialogOpen}>
                        <DialogTrigger asChild>
                            {(!consultation.medical_records || consultation.medical_records.length === 0) && (
                                <Button variant="outline" className='me-4'>Añadir Registro Médico</Button>
                            )}

                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle>{selectedMedicalRecord ? 'Actualizar Registro Médico' : 'Añadir Nuevo Registro Médico'}</DialogTitle>
                                <DialogDescription>
                                    Completa los detalles para {selectedMedicalRecord ? 'actualizar' : 'añadir'} un registro al historial del paciente.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitMedicalRecord} className="grid gap-4 py-4">
                                <MedicalRecordForm
                                    data={medicalRecordData}
                                    setData={setMedicalRecordData}
                                    errors={medicalRecordErrors}
                                />
                                <DialogFooter>
                                    <Button type="submit" disabled={medicalRecordProcessing}>
                                        {medicalRecordProcessing ? 'Guardando...' : (selectedMedicalRecord ? 'Actualizar Registro Médico' : 'Guardar Registro Médico')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button variant="default" onClick={() => window.open(route('consultationpdf', consultation.id), '_blank')}>
                        <Download />
                        Descargar Comprobante
                    </Button>
                </div>
            </Heading>

            {/* Formulario de Actualización de la Consulta */}
            <div className="mb-8">
                <form className="flex flex-col gap-4" onSubmit={submitConsultation}>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <ConsultationsForm
                            data={{
                                ...data,
                                patient: consultation.patient
                            }}
                            patients={patients}
                            users={users}
                            services={services}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                    <Button type="submit" variant="default">
                        Actualizar Consulta
                    </Button>
                </form>
            </div>

            {/* Sección de Línea de Tiempo del Historial Médico */}
            {consultation.medical_records && consultation.medical_records.length > 0 && (
                <div className="mt-8 py-6 ">
                    <h2 className="text-xl font-bold mb-4">Historial Médico del Paciente</h2>
                    <MedicalRecordTimeline
                        medicalRecords={consultation.medical_records || []}
                        initialVisibleCount={3}
                        onEdit={openMedicalRecordDialog} // Pasar la función para abrir el dialog
                    />
                </div>
            )}
            {(!consultation.medical_records || consultation.medical_records.length === 0) && (
                <div className="mt-8 py-6">
                    <h2 className="text-xl font-bold mb-4">Historial Médico del Paciente</h2>
                    <p className="text-gray-600">No hay registros médicos asociados a esta consulta.</p>
                </div>
            )}
        </ContentLayout>
    );
}
