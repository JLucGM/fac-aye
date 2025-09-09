import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import InvoicesForm from './InvoicesForm';
import { Invoice, Patient, type BreadcrumbItem, CreateInvoiceFormData, Payment, PaymentMethod } from '@/types';
import { Download } from 'lucide-react';

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
        title: 'Editar Factura',
        href: '#',
    },
];

// Define las props que recibirá el componente Edit
type EditInvoiceProps = {
    invoice: Invoice;
    patients: Patient[];
    paymentMethods: PaymentMethod[]; // Ajusta el tipo según tus datos reales
};

export default function Edit({ invoice, patients, paymentMethods }: EditInvoiceProps) {
    // console.log(invoice);
    // Inicializa el formulario con los datos de la factura existente
    const { data, setData, errors, put, processing } = useForm({
        invoice_number: invoice.invoice_number,
        patient_id: invoice.patient_id,
        invoice_date: invoice.invoice_date,
        payment_method_id: invoice.payment_method_id, // agregar método de pago
        notes: invoice.notes ?? '',
        // invoice_img: null, // para la imagen nueva (vacío inicialmente)
        items: (invoice.items ?? []).map(item => ({
            id: item.id,
            service_name: item.service_name, // agregar service_name
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_total: item.line_total,
        })),
    });


    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Usa 'put' para la actualización
        put(route('invoices.update', invoice.id), {
            // forceFormData: true,
            onSuccess: (res) => {
            },
            onError: (err) => {
                console.error("Error al actualizar la factura:", err);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Factura" />
            <Heading
                title="Editar Factura"
                description={`Aquí puedes editar la factura #${invoice.invoice_number}.`}
            >
                <Button
                    variant="default"
                    onClick={() => window.open(route('invoices.pdf', invoice.id), '_blank')}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Factura PDF
                </Button>
            </Heading>

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <InvoicesForm
                    data={data}
                    patients={patients}
                    paymentMethods={paymentMethods}
                    setData={setData}
                    errors={errors}
                />

                <Button
                    variant={"default"}
                    type="submit"
                    disabled={processing}
                >
                    {processing ? 'Actualizando...' : 'Actualizar Factura'}
                </Button>
            </form>
        </ContentLayout>
    );
}
