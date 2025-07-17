// resources/js/Pages/Invoices/Edit.tsx

import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import InvoicesForm from './InvoicesForm'; // Importa el componente del formulario
import { Invoice, Patient, Consultation, type BreadcrumbItem, CreateInvoiceFormData } from '@/types';
import { toast } from 'sonner'; // Si usas sonner para notificaciones
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
    consultations: Consultation[];
};

export default function Edit({ invoice, patients, consultations }: EditInvoiceProps) {
    // Inicializa el formulario con los datos de la factura existente
    const { data, setData, errors, put, processing } = useForm<CreateInvoiceFormData>({
        patient_id: invoice.patient_id,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        notes: invoice.notes ?? '', // Asegúrate de que notes no sea null
        items: invoice.items.map(item => ({ // Mapea los ítems existentes
            id: item.id, // Es crucial incluir el ID del ítem para la actualización
            consultation_id: item.consultation_id,
            // description: item.description,
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
                toast.success("Factura actualizada con éxito.");
            },
            onError: (err) => {
                console.error("Error al actualizar la factura:", err);
                toast.error("Error al actualizar la factura. Revisa los campos.");
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
                    // Usa window.open para abrir el PDF en una nueva pestaña
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
                    consultations={consultations}
                    setData={setData}
                    errors={errors}
                    isEditing={true} // Pasa esta prop para indicar modo edición
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
