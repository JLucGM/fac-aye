import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Consultation, CreatePaymentFormData, Patient, Payment, PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import PaymentsForm from './PaymentsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
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
        patient_id: null, // Agrega esta línea para inicializar patient_id
        consultation_ids: [],
        payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null, // Cambia a null si no hay métodos de pago
        amount: 0,
        status: 'earring',
        reference: '',
        notes: '',
        // paid_at: new Date().toISOString().split('T')[0],
    });


    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('payments.store'), {
            onSuccess: () => {
                console.log("Pago creado con éxito");
                // toast("Pago creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el pago:", err);
                // toast("Error al crear el pago.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Pago" />

            <ContentLayout>
                <Heading
                    title="Crear Pago"
                    description="Aquí puedes crear un nuevo pago para un paciente."
                />
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PaymentsForm
                        data={data}
                        patients={patients}
                        paymentMethods={paymentMethods}
                        consultations={consultations}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Crear Pago
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
