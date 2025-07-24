import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {ContentLayout} from '@/layouts/content-layout';
import PaymentMethodsForm from './PaymentMethodsForm';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Métodos de Pago',
        href: '/payment-methods',
    },
    {
        title: 'Crear Método de Pago',
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
             
            },
            onError: (err) => {
                console.error("Error al crear el Método de pago:", err);
            },
        });
    };

    return (
        // <AppLayout breadcrumbs={breadcrumbs}>

            <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Método de Pago" />
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
        // </AppLayout>
    );
}
