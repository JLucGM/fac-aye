import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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

export default function Create() {
    const { data, setData, errors, post } = useForm({
            patient_id: '',
            consultation_id: '',
            payment_method_id: '',
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
