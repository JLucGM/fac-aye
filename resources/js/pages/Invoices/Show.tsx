import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { Invoice, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Download, ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

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

type MediaItem = {
    collection_name: string;
    original_url: string;
    name: string;
};



export default function Show({ invoice }: { invoice: Invoice }) {
    const invoice_img = invoice.media.find((mediaItem: MediaItem) => mediaItem.collection_name === 'invoice_img');
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar el diálogo

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title={`Factura ${invoice.invoice_number}`} />
            <Heading
                title={`Factura ${invoice.invoice_number}`}
                description="Detalles de la factura"
            >
                <div className="flex gap-4">
                    {invoice_img && (
                        <div className="flex justify-center">
                            <Button onClick={() => setIsDialogOpen(true)} >
                                <ImageIcon />
                                Ver adjunto
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="default"
                        onClick={() => window.open(route('invoices.pdf', invoice.id), '_blank')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Factura PDF
                    </Button>
                </div>
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
                            {(invoice.items ?? []).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.service_name}</TableCell>
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Factura: {invoice.invoice_number}</DialogTitle>
                        <DialogDescription>
                            {invoice_img ? (
                                <img
                                    src={invoice_img.original_url}
                                    alt={invoice_img.name}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <p>No hay imagen adjunta.</p>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </ContentLayout>
    );
}
