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
import PatientInfo from '@/components/patients-info';

// Definición de las migas de pan para la navegación
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

// Definición de tipos para los medios
type MediaItem = {
    collection_name: string;
    original_url: string;
    name: string;
};

// Componente principal de React para la vista de la factura
export default function Show({ invoice }: { invoice: Invoice }) {
    // Busca la imagen de la factura en los medios asociados
    const invoice_img = invoice.media.find((mediaItem: MediaItem) => mediaItem.collection_name === 'invoice_img');
    // const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Inicializa el formulario con Inertia.js `useForm`
    // Se añade `_method: 'put'` para el "method spoofing"
    // const { data, setData, errors, get, processing } = useForm({
    //     invoice_img: null as File | null,
    //     // _method: 'put', // Este campo le indica a Laravel que lo trate como una solicitud PUT
    // });

    // const submit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     // console.log("Archivo seleccionado:", data.invoice_img ? data.invoice_img.name : "Ningún archivo");

    //     console.log(data);
    //     // Cambiamos 'put' a 'post' para enviar el archivo correctamente
    //     get(route('invoices.updateImage', invoice), {
    //         onSuccess: (response) => {
    //             console.log("Actualización exitosa:", response);
    //             // Cerrar el diálogo después de una subida exitosa
    //             setIsDialogOpen(false);
    //         },
    //         onError: (err) => {
    //             console.error("Error al actualizar la factura:", err);
    //         },
    //     });
    // };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title={`Factura ${invoice.invoice_number}`} />

            <Heading
                title={`Factura ${invoice.invoice_number}`}
                description="Detalles de la factura"
            >
                <div className="flex gap-4">
                    {/* Botón para abrir el diálogo, ahora siempre visible */}
                    {/* <Button onClick={() => setIsDialogOpen(true)}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Ver adjunto
                    </Button> */}
                    <Button
                        variant="default"
                        onClick={() => window.open(route('invoices.pdf', invoice.id), '_blank')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar factura
                    </Button>
                </div>
            </Heading>

            <div className=" mt-6 space-y-6">

                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="mb-4">
                    <h2 className="text-base font-semibold">Información de la Factura</h2>
                    <div >
                        <p>Número: {invoice.invoice_number}</p>
                        <p>Fecha de realización: {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                    </div>
                    {invoice.notes && <p className="mt-4">Notas: {invoice.notes}</p>}
                </div>

                {/* Información del paciente */}
                <div className="mb-4">
                    {invoice.patient ? (
                        <PatientInfo patient={invoice.patient} />
                    ) : (
                        <p>No hay información de paciente asociada a esta factura.</p>
                    )}
                </div>
                </div>

                {/* Tabla de ítems */}
                <div className="mb-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cantidad</TableHead>
                                    <TableHead className="text-right">Descripción</TableHead>
                                    <TableHead className="text-right">P. Unitario</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-right">{item.service_name}</TableCell>
                                        <TableCell className="text-right">${item.unit_price}</TableCell>
                                        <TableCell className="text-right">${item.line_total}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-bold">
                                    <TableCell className="text-right">
                                        {invoice.payment_method ? (
                                            <div>
                                                <p>Método de pago: {invoice.payment_method.name}</p>
                                            </div>
                                        ) : (
                                            <p>No hay información de método de pago asociada a esta factura.</p>
                                        )}
                                    </TableCell>
                                    <TableCell colSpan={2} className="text-right">Total:</TableCell>
                                    <TableCell className="text-right">${invoice.total_amount}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className='w-[35rem]'>
                    <DialogHeader>
                        <DialogTitle>Factura {invoice.invoice_number}</DialogTitle>
                    </DialogHeader>

                    {invoice_img ? (
                        <>
                            <DialogDescription className="mt-4">
                                <img
                                    src={invoice_img.original_url}
                                    alt={`Factura ${invoice.invoice_number}`}
                                    className="w-full h-auto"
                                />
                            </DialogDescription>
                            <div className="mt-4 space-y-4">
                                <h3 className="text-lg font-semibold">Subir nueva versión</h3>
                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="invoice_img_dialog">Archivo de factura</Label>
                                        <Input
                                            id="invoice_img_dialog"
                                            type="file"
                                            name="invoice_img"
                                            className="mt-1 block w-full"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setData('invoice_img', e.target.files[0]);
                                                } else {
                                                    setData('invoice_img', null);
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                        <InputError message={errors.invoice_img} className="mt-2" />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Subiendo...' : 'Subir Factura'}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogDescription>No hay imagen adjunta para esta factura.</DialogDescription>
                            <div className="mt-4 space-y-4">
                                <h3 className="text-lg font-semibold">Subir nueva factura</h3>
                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="invoice_img_dialog">Archivo de factura</Label>
                                        <Input
                                            id="invoice_img_dialog"
                                            type="file"
                                            name="invoice_img"
                                            className="mt-1 block w-full"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setData('invoice_img', e.target.files[0]);
                                                } else {
                                                    setData('invoice_img', null);
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                        <InputError message={errors.invoice_img} className="mt-2" />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Subiendo...' : 'Subir Factura'}
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog> */}
        </ContentLayout>
    );
}