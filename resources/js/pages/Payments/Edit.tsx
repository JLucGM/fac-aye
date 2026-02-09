import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, Patient, Payment, PaymentMethod, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaymentsForm from './PaymentsForm';
import Heading from '@/components/heading';
import PatientInfo from '@/components/patients-info';
import { useState } from 'react';
import { ConfirmPaymentDialog } from '@/components/payments/ConfirmPaymentDialog'; // Ajusta la ruta según tu estructura

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Lista de Pagos',
        href: '/payments',
    },
    {
        title: 'Editar Pago',
        href: '#',
    },
];

export default function Edit({ payment, paymentMethods, patients, consultations }: { 
    payment: Payment, 
    paymentMethods: PaymentMethod[], 
    patients: Patient[], 
    consultations: Consultation[] 
}) {
    // Obtener IDs de consulta de la relación cargada
    const initialConsultationIds = (payment.consultations || []).map(c => c.id);
    
    const initialPatientId = payment.patient_id ||
        (payment.consultations?.[0]?.patient_id) ||
        null;

    const { data, setData, errors, put, processing } = useForm({
        patient_id: initialPatientId,
        consultation_ids: initialConsultationIds,
        subscription_ids: payment.subscription_ids || [],
        payment_method_id: payment.payment_method_id,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
        notes: payment.notes,
        payment_type: payment.payment_type || 'consulta',
    });

    // Estados para el diálogo de confirmación
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [pendingItems, setPendingItems] = useState<(Consultation | Subscription)[]>([]);
    const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);

    // Obtener todas las suscripciones de los pacientes
    const getAllSubscriptions = () => {
        const allSubs: Subscription[] = [];
        patients.forEach(patient => {
            if (patient.subscriptions) {
                allSubs.push(...patient.subscriptions);
            }
        });
        return allSubs;
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Obtener todas las suscripciones antes de mostrar el diálogo
        setAllSubscriptions(getAllSubscriptions());
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmUpdate = () => {
        put(route('payments.update', payment.id), {
            onSuccess: () => {
                setIsConfirmDialogOpen(false);
            },
            onError: (err) => {
                console.error("Error al actualizar el pago:", err);
                setIsConfirmDialogOpen(false);
            },
        });
    };

    const selectedPatient = patients.find(patient => patient.id === data.patient_id);

    // Obtener las suscripciones del paciente seleccionado
    const getPatientSubscriptions = () => {
        if (!selectedPatient || !selectedPatient.subscriptions) return [];
        return selectedPatient.subscriptions;
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Pago" />
            <Heading
                title="Editar Pago"
                description="Aquí puedes editar un pago existente."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form className="col-span-2 gap-4" onSubmit={submit}>
                    <PaymentsForm
                        data={data}
                        patients={patients}
                        paymentMethods={paymentMethods}
                        consultations={consultations}
                        setData={setData}
                        errors={errors}
                        initialSelectedConsultationIds={initialConsultationIds}
                        onPendingItemsChange={setPendingItems}
                    />

                    <Button variant={"default"} className='w-full mt-4' disabled={processing}>
                        {processing ? 'Actualizando...' : 'Actualizar Pago'}
                    </Button>
                </form>

                <div className="mt-4">
                    <PatientInfo patient={selectedPatient} />
                </div>
            </div>

            {/* Diálogo de confirmación para actualizar */}
            <ConfirmPaymentDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                onConfirm={handleConfirmUpdate}
                title="Confirmar Actualización de Pago"
                description="Por favor, revisa los cambios antes de actualizar el pago."
                confirmButtonText="Confirmar Cambios"
                processing={processing}
                type="update"
                data={data}
                patients={patients}
                paymentMethods={paymentMethods}
                consultations={consultations}
                subscriptions={getPatientSubscriptions()}
                selectedItems={pendingItems}
            />
        </ContentLayout>
    );
}