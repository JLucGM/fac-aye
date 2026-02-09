import { Consultation, CreatePaymentFormData, Patient, PaymentMethod, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
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
        title: 'Crear Pago',
        href: '/payments/create',
    },
];

export default function Create({ paymentMethods, patients, consultations }: { 
    paymentMethods: PaymentMethod[], 
    patients: Patient[], 
    consultations: Consultation[] 
}) {
    const { data, setData, errors, post, processing } = useForm<CreatePaymentFormData>({
        patient_id: null,
        consultation_ids: [],
        subscription_ids: [],
        payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null,
        amount: 0,
        status: 'pendiente',
        reference: '',
        notes: '',
        payment_type: 'consulta',
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

    const handleConfirmCreate = () => {
        post(route('payments.store'), {
            onSuccess: () => {
                setIsConfirmDialogOpen(false);
            },
            onError: (err) => {
                console.error("Error al crear el pago:", err);
                setIsConfirmDialogOpen(false);
            },
        });
    };

    // Encuentra el paciente seleccionado
    const selectedPatient = patients.find(patient => patient.id === data.patient_id);

    // Obtener las suscripciones del paciente seleccionado
    const getPatientSubscriptions = () => {
        if (!selectedPatient || !selectedPatient.subscriptions) return [];
        return selectedPatient.subscriptions;
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Pago" />
            <Heading
                title="Crear Pago"
                description="Aquí puedes crear un nuevo pago para un paciente."
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
                        onPendingItemsChange={setPendingItems}
                    />

                    <Button variant={"default"} className="w-full mt-4" disabled={processing}>
                        {processing ? 'Creando...' : 'Crear Pago'}
                    </Button>
                </form>

                <div className="mt-4">
                    <PatientInfo patient={selectedPatient} />
                </div>
            </div>

            {/* Diálogo de confirmación para crear */}
            <ConfirmPaymentDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                onConfirm={handleConfirmCreate}
                title="Confirmar Creación de Pago"
                description="Por favor, revisa los detalles del pago antes de confirmar."
                confirmButtonText="Confirmar y Crear"
                processing={processing}
                type="create"
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