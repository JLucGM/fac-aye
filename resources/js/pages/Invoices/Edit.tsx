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

export default function Edit({ invoice, patients, paymentMethods  }: EditInvoiceProps) {
    console.log("Datos de la factura recibidos:", invoice);
    // Inicializa el formulario con los datos de la factura existente
    const { data, setData, errors, put, processing } = useForm<CreateInvoiceFormData>({
        invoice_number: invoice.invoice_number, // Asegúrate de que el número de factura se mantenga
        patient_id: invoice.patient_id,
        invoice_date: invoice.invoice_date,
        notes: invoice.notes ?? '', // Asegúrate de que notes no sea null
        items: (invoice.items ?? []).map(item => ({
            id: item.id, // Asegúrate de que el ID sea un número o null
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_total: item.line_total,
        })),
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Usa 'put' para la actualización
        put(route('invoices.update', invoice.id), {
            onSuccess: () => {
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
