import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ServicesForm from './PaymentsForm';
import { Button } from '@/components/ui/button';

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

export default function Edit({ service }: { service: any }) {

    const { data, setData, errors, put, recentlySuccessful } = useForm({
        patient_id: service.patient_id,
        consultation_id: service.consultation_id,
        payment_method_id: service.payment_method_id,
        amount: service.amount,
        status: service.status,
        reference: service.reference,
        notes: service.notes,
        paid_at: service.paid_at,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
                console.log(data); // Verifica que los datos se están actualizando

        put(route('services.update', service), {
            onSuccess: () => {
                console.log("Servicio actualizado con éxito:", data);
                // toast("Servicio actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el servicio:", err);
                // toast("Error al actualizar el servicio.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <ContentLayout>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <ServicesForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Update Service
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}

