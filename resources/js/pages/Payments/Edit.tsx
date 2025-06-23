import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaymentsForm from './PaymentsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payments',
        href: '/payments',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ payment, paymentMethods, patients, consultations }: { payment: any, paymentMethods: any[], patients: any[], consultations: any[] }) {
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
    console.log(payment)

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data); // Verifica que los datos se están actualizando

        put(route('payments.update', payment.id), { // Asegúrate de que la ruta sea correcta
            onSuccess: () => {
                console.log("Pago actualizado con éxito:", data);
                // Aquí puedes mostrar un mensaje de éxito
            },
            onError: (err) => {
                console.error("Error al actualizar el pago:", err);
                // Aquí puedes mostrar un mensaje de error
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Pago" />

            <ContentLayout>
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
                        Update Payment
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
