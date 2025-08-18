import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import InvoicesForm from './InvoicesForm';
import { Patient, type BreadcrumbItem, CreateInvoiceFormData, PaymentMethod } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Facturas',
        href: '/invoices',
    },
    {
        title: 'Crear Factura',
        href: '#',
    },
];

export default function Create({ patients, paymentMethods }: { patients: Patient[], paymentMethods: PaymentMethod[] }) {
    const { data, setData, errors, post, processing } = useForm({
        invoice_number: `INV-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`, // Generar número de factura
        patient_id: null,
        invoice_date: new Date().toISOString().split('T')[0],
        payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null, // Cambia a null si no hay métodos de pago
        notes: '',
        invoice_img:'',
        items: [
            {
                id: null, // Agregar el campo id
                service_name: '', // Agregar el campo para el nombre del servicio
                quantity: 1,
                unit_price: 0,
                line_total: 0,
            }
        ],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data)
        post(route('invoices.store'), {
            onSuccess: () => {
                // Puedes agregar lógica adicional aquí si es necesario
            },
            onError: (err) => {
                console.error("Error al crear la factura:", err);
            },
        });
    };

    // Calcular el total de la factura
    const calculateTotal = () => {
        return data.items.reduce((total, item) => total + item.line_total, 0);
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Factura" />
            <Heading
                title="Crear Factura"
                description="Aquí puedes crear una nueva factura para un paciente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <InvoicesForm
                    data={data}
                    patients={patients}
                    paymentMethods={paymentMethods}
                    setData={setData}
                    errors={errors}
                />

<div className="mt-4">
                    <h3 className="text-lg font-semibold">Total de la Factura: ${calculateTotal().toFixed(2)}</h3>
                </div>

                <Button
                    variant={"default"}
                    type="submit"
                    disabled={processing}
                >
                    {processing ? 'Creando...' : 'Crear Factura'}
                </Button>
            </form>
        </ContentLayout>
    );
}
