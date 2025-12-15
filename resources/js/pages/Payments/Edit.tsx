import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, Patient, Payment, PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaymentsForm from './PaymentsForm';
import Heading from '@/components/heading';
import PatientInfo from '@/components/patients-info';

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

export default function Edit({ payment, paymentMethods, patients, consultations }: { payment: Payment, paymentMethods: PaymentMethod[], patients: Patient[], consultations: Consultation[] }) {

    // --- CORRECCIÓN CLAVE: OBTENER IDs DE CONSULTA DE LA RELACIÓN CARGADA ---
    // Mapeamos la relación 'consultations' para obtener solo los IDs [4]
    const initialConsultationIds = (payment.consultations || []).map(c => c.id);

    // Tu JSON de ejemplo ya tiene patient_id: 6, por lo que esto debería estar bien
    const initialPatientId = payment.patient_id ||
        (payment.consultations?.[0]?.patient_id) ||
        null;

    const { data, setData, errors, put, recentlySuccessful } = useForm({
        patient_id: initialPatientId,
        // Inicializamos con los IDs de las consultas ya asociadas
        consultation_ids: initialConsultationIds,

        payment_method_id: payment.payment_method_id,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
        notes: payment.notes,
        // paid_at: payment.paid_at,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('payments.update', payment.id), { // Asegúrate de que la ruta sea correcta
            onSuccess: () => {
            },
            onError: (err) => {
                console.error("Error al actualizar el pago:", err);
            },
        });
    };

    const selectedPatient = patients.find(patient => patient.id === data.patient_id);

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
                    />

                    <Button variant={"default"} className='w-full mt-4'>
                        Actualizar Pago
                    </Button>
                </form>

                <div className="mt-4">
                    <PatientInfo patient={selectedPatient} />
                </div>
            </div>
        </ContentLayout>
    );
}