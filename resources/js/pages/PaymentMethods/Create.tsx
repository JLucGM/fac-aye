import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import PaymentMethodsForm from './PaymentMethodsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payment Methods',
        href: '/payment-methods',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function Create() {
    const { data, setData, errors, post } = useForm({
        name: '', // Asegúrate de que sea string
        description: '', // Asegúrate de que sea string
        active: false, // Asegúrate de que sea booleano
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('payment-methods.store'), {
            onSuccess: () => {
                console.log("Metodo de pago creado con éxito:", data);
                // toast("Metodo de pago creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el Metodo de pago:", err);
                // toast("Error al crear el Metodo de pago.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Método de Pago" />

            <ContentLayout>
                <Heading
                    title="Crear Método de Pago"
                    description="Aquí puedes crear un nuevo método de pago."
                />
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PaymentMethodsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button
                        variant={"default"}
                    >
                        Crear Método de Pago
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
