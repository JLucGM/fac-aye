import { ContentLayout } from '@/layouts/content-layout';
import { Payment, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Asegúrate de que la ruta sea correcta
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Lista de Pagos',
        href: '/payments',
    },
    {
        title: 'Mostrar Pago',
        href: '#',
    },
];

export default function Show({ payment }: { payment: Payment }) {

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Detalles del Pago" />
            <Heading
                title="Detalles del Pago"
                description="Aquí puedes ver la información de un pago existente."
            />

            <h1 className="text-2xl font-bold mb-4">Detalles del Pago</h1>

            <div className="mb-4">
                <h2 className="text-xl font-semibold">Información del Pago</h2>
                <p><strong>ID:</strong> {payment.id}</p>
                <p><strong>Monto:</strong> ${payment.amount}</p>
                <p><strong>Estado:</strong> {payment.status}</p>
                <p><strong>Referencia:</strong> {payment.reference}</p>
                <p><strong>Notas:</strong> {payment.notes}</p>
                {/* <p><strong>Fecha de Pago:</strong> {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'No disponible'}</p> */}
                <p><strong>Método de Pago:</strong> {payment.payment_method_id}</p>
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold">Consultas Asociadas</h2>
                {payment.consultations && payment.consultations.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Consulta ID</TableHead>
                                <TableHead>Paciente</TableHead>
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
                                    <TableCell>{consultation.patient?.name}</TableCell>
                                    <TableCell>{consultation.consultation_type}</TableCell>
                                    <TableCell>{consultation.status}</TableCell>
                                    <TableCell>{new Date(consultation.scheduled_at).toLocaleDateString()}</TableCell>
                                    <TableCell>${consultation.amount}</TableCell>
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
    );
}
