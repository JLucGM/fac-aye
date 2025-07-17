// resources/js/Pages/Invoices/Create.tsx

import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import InvoicesForm from './InvoicesForm';
import { Consultation, Patient, type BreadcrumbItem, CreateInvoiceFormData } from '@/types'; // Eliminado Service
import { toast } from 'sonner';

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

export default function Create({ patients, consultations }: { patients: Patient[], consultations: Consultation[] }) { // Eliminado services
    const { data, setData, errors, post, processing } = useForm<CreateInvoiceFormData>({
        patient_id: null,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        items: [
            {
                // service_id: null, // <-- ELIMINADO
                consultation_id: null,
                // description: '',
                quantity: 1,
                unit_price: 0,
                line_total: 0,
            }
        ],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('invoices.store'), {
            onSuccess: () => {
                toast.success("Factura creada con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear la factura:", err);
                toast.error("Error al crear la factura. Revisa los campos.");
            },
        });
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
                    consultations={consultations}
                    // services={services} // <-- ELIMINADO
                    setData={setData}
                    errors={errors}
                />

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
