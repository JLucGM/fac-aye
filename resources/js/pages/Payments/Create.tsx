import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Consultation, Patient, PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import PaymentsForm from './PaymentsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'payments',
        href: '/payments',
    },
    {
        title: 'Create',
        href: '/payments/create',
    },
];

export default function Create({ paymentMethods, patients, consultations }: { paymentMethods: PaymentMethod[], patients: Patient[], consultations: Consultation[] }) {
console.log("Payment Methods:", paymentMethods);
console.log("Patients:", patients);
console.log("Consultations:", consultations);

    const { data, setData, errors, post } = useForm({
        patient_id: patients.length > 0 ? Number(patients[0].id) : 0, // Convertido a number
        consultation_id: consultations.length > 0 ? Number(consultations[0].id) : 0, // Convertido a number
        payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : 0, // Convertido a number
        amount: 0,
        status: 'pendiente',
        reference: '',
        notes: '',
        paid_at: new Date().toISOString().split('T')[0],
    });


    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: () => {
                console.log("Servicio creado con éxito:", data);
                // toast("Servicio creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el servicio:", err);
                // toast("Error al crear el servicio.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />

            <ContentLayout>

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PaymentsForm
                        data={data}
                        patients={patients}
                        paymentMethods={paymentMethods}
                        consultations={consultations}
                        setData={setData}
                        errors={errors}
                    />

                    <Button
                        variant={"default"}
                    >
                        Create Service
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
