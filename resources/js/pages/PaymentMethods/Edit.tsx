import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaymentMethodsForm from './PaymentMethodsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Listado de Métodos de Pago',
        href: '/payment-methods',
    },
    {
        title: 'Editar Método de Pago',
        href: '#',
    },
];

export default function Edit({ paymentMethod }: { paymentMethod: PaymentMethod }) {

    // Initialize form data, ensuring optional properties default to empty strings or false
    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: paymentMethod.name || '', // Ensure name is a string
        description: paymentMethod.description || '', // Ensure description is a string
        active: paymentMethod.active ?? false, // Ensure active is a boolean, using nullish coalescing for safety
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const routeFn = (name: string, params?: string | object | number) => (window as any).route(name, params);

        put(routeFn('payment-methods.update', paymentMethod.slug), {
            onSuccess: () => {
                console.log("Método de pago actualizado con éxito:");
                // toast("Método de pago actualizado con éxito."); // Uncomment if you have sonner setup
            },
            onError: (err) => {
                console.error("Error al actualizar el método de pago:", err);
                // toast("Error al actualizar el método de pago."); // Uncomment if you have sonner setup
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Método de Pago" /> {/* Updated Head title */}

            <ContentLayout>
                <Heading
                    title="Editar Método de Pago" // Updated heading title for clarity
                    description="Aquí puedes editar un método de pago existente."
                />
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PaymentMethodsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Actualizar Método de Pago
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}