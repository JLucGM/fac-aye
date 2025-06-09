import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaymentMethodsForm from './PaymentMethodsForm';

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
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ paymentMethod }: { paymentMethod: any }) {

    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: paymentMethod.name || '', // Asegúrate de que sea una cadena
        description: paymentMethod.description || '', // Asegúrate de que sea una cadena
        active: paymentMethod.active || false, // Asegúrate de que sea booleano
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

            put(route('payment-methods.update', paymentMethod), {
            onSuccess: () => {
                console.log("Método de pago actualizado con éxito:", data);
                // toast("Método de pago actualizado con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar el método de pago:", err);
                // toast("Error al actualizar el método de pago.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />

            <ContentLayout>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PaymentMethodsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Update paymentMethod
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}

