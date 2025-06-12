import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Consultation, Payment, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Asegúrate de que la ruta sea correcta

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payments',
        href: '/payments',
    },
    {
        title: 'Show Payment',
        href: '#',
    },
];

export default function Show({ payment }: { payment: Payment }) {
    console.log(payment);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Payment" />

            <ContentLayout>
                <h1 className="text-2xl font-bold mb-4">Detalles del Pago</h1>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Información del Pago</h2>
                    <p><strong>ID:</strong> {payment.id}</p>
                    <p><strong>Monto:</strong> ${parseFloat(payment.amount).toFixed(2)}</p>
                    <p><strong>Estado:</strong> {payment.status}</p>
                    <p><strong>Referencia:</strong> {payment.reference}</p>
                    <p><strong>Notas:</strong> {payment.notes}</p>
                    <p><strong>Fecha de Pago:</strong> {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'No disponible'}</p>
                    <p><strong>Método de Pago:</strong> {payment.payment_method_id}</p>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Consultas Asociadas</h2>
                    {payment.consultations && payment.consultations.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Consulta ID</TableHead>
                                    <TableHead>Tipo de Consulta</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Programada</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Notas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payment.consultations.map((consultation) => (
                                    <TableRow key={consultation.id}>
                                        <TableCell>{consultation.id}</TableCell>
                                        <TableCell>{consultation.consultation_type}</TableCell>
                                        <TableCell>{consultation.status}</TableCell>
                                        <TableCell>{new Date(consultation.scheduled_at).toLocaleDateString()}</TableCell>
                                        <TableCell>${parseFloat(consultation.amount).toFixed(2)}</TableCell>
                                        <TableCell>{consultation.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p>No hay consultas asociadas a este pago.</p>
                    )}
                </div>
            </ContentLayout>
        </AppLayout>
    );
}
