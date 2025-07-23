import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Asegúrate de importar los componentes de la tabla
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Invoice, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
        title: 'Ver Factura',
        href: '#',
    },
];

export default function Show({ invoice }: { invoice: Invoice }) {
    // console.log("Factura recibida:", invoice);
    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title={`Factura ${invoice.invoice_number}`} />
            <Heading
                title={`Factura ${invoice.invoice_number}`}
                description="Detalles de la factura"
            >
                <Button
                    variant="default"
                    onClick={() => window.open(route('invoices.pdf', invoice.id), '_blank')}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Factura PDF
                </Button>
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mt-4">
                    <h2>Información de la Factura</h2>
                    <p><strong>Número de Factura:</strong> {invoice.invoice_number}</p>
                    <p><strong>Fecha de Factura:</strong> {new Date(invoice.invoice_date).toLocaleDateString('es-ES')}</p>
                    <p><strong>Notas:</strong> {invoice.notes || 'No hay notas'}</p>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Ítems de la Factura</h2>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nro. de asistencia</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio Unitario</TableHead>
                                <TableHead>Total de Línea</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(invoice.items ?? []).map((item) => ( // Proporcionar un valor predeterminado
                                <TableRow key={item.consultation_id}>
                                    <TableCell>{item.consultation_id}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.unit_price}</TableCell>
                                    <TableCell>${item.line_total}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                                <TableCell className="font-bold">${invoice.total_amount}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ContentLayout>
    );
}
