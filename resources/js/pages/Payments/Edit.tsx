import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, Patient, Payment, PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaymentsForm from './PaymentsForm';
import Heading from '@/components/heading';

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
    const { data, setData, errors, put, recentlySuccessful } = useForm({
        patient_id: payment.patient_id || null, // Agrega esta línea para inicializar patient_id
        consultation_ids: payment.consultation_ids || [], // Asegúrate de que sea un array
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
                // console.log("Pago actualizado con éxito");
                // Aquí puedes mostrar un mensaje de éxito
            },
            onError: (err) => {
                console.error("Error al actualizar el pago:", err);
                // Aquí puedes mostrar un mensaje de error
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Pago" />
            <Heading
                title="Editar Pago"
                description="Aquí puedes editar un pago existente."
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
                    Actualizar Pago
                </Button>
            </form>
        </ContentLayout>
    );
}
