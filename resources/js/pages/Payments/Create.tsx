import { Consultation, CreatePaymentFormData, Patient, PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
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
        title: 'Crear Pago',
        href: '/payments/create',
    },
];

export default function Create({ paymentMethods, patients, consultations }: { paymentMethods: PaymentMethod[], patients: Patient[], consultations: Consultation[] }) {
    const { data, setData, errors, post } = useForm<CreatePaymentFormData>({
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
    console.log(patients);
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        post(route('payments.store'), {
            onSuccess: () => {
                // Manejar éxito
            },
            onError: (err) => {
                console.error("Error al crear el pago:", err);
            },
        });
    };

    // Encuentra el paciente seleccionado
    const selectedPatient = patients.find(patient => patient.id === data.patient_id);

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
                    />

                    <Button variant={"default"} className="w-full mt-4">
                        Crear Pago
                    </Button>
                </form>

                <div className="mt-4">
                    {/* {selectedPatient ? ( */}
                        <PatientInfo patient={selectedPatient} />
                    {/* ) : (
                        <p>No se ha seleccionado ningún paciente.</p>
                    )}*/}
                </div>
            </div>
        </ContentLayout>
    );
}
