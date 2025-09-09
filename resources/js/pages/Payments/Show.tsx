import { ContentLayout } from '@/layouts/content-layout';
import { Payment, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Heading from '@/components/heading';
import PatientInfo from '@/components/patients-info';

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
    // console.log(payment);

    // Determinar si el pago es por consultas o por suscripciones
    const isSubscriptionPayment = payment.patient_subscriptions && payment.patient_subscriptions.length > 0;
    const patient = isSubscriptionPayment 
        ? payment.patient_subscriptions[0].patient 
        : payment.consultations.length > 0 
            ? payment.consultations[0].patient 
            : null;

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Detalles del Pago" />
            <Heading
                title="Detalles del Pago"
                description="Aquí puedes ver la información de un pago existente."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <p className='capitalize'>Fecha de Creación: {new Date(payment.created_at).toLocaleDateString()}</p>
                    <p className='capitalize'>Última Actualización: {new Date(payment.updated_at).toLocaleDateString()}</p>
                    {payment.payment_method && (
                        <p className='capitalize'>Método: {payment.payment_method.name}</p>
                    )}
                    <p className='capitalize'>Estado: {payment.status}</p>
                    <p className='capitalize'>Referencia: {payment.reference || 'N/A'}</p>
                    <p className='capitalize'>Notas: {payment.notes || 'N/A'}</p>
                </div>

                {/* Información del Paciente */}
                {patient && (
                    <div className="mb-4">
                        <PatientInfo patient={patient} />
                    </div>
                )}
            </div>

            {/* Asistencias o Funcionales Asociadas */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold">{isSubscriptionPayment ? 'Funcionales Asociadas' : 'Asistencias Asociadas'}</h2>
                {isSubscriptionPayment ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Suscripción ID</TableHead>
                                <TableHead>Periodo</TableHead>
                                <TableHead>Asistencias Usadas</TableHead>
                                <TableHead>Asistencias Restantes</TableHead>
                                <TableHead>Monto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payment.patient_subscriptions?.map((subscription) => (
                                <TableRow key={subscription.id}>
                                    <TableCell>{subscription.subscription.name}</TableCell>
                                    <TableCell>
                                        Comienzo: <p>{new Date(subscription.start_date).toLocaleDateString()}</p>
                                        Fin: <p>{new Date(subscription.end_date).toLocaleDateString()}</p>
                                    </TableCell>
                                    {/* <TableCell>{new Date(subscription.end_date).toLocaleDateString()}</TableCell> */}
                                    <TableCell>{subscription.consultations_used}</TableCell>
                                    <TableCell>{subscription.consultations_remaining}</TableCell>
                                    <TableCell>{subscription.subscription.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4}>Total</TableCell>
                                <TableCell>${payment.amount}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                ) : (
                    payment.consultations && payment.consultations.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tipo de Consulta</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Programada</TableHead>
                                    <TableHead>Monto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payment.consultations.map((consultation) => (
                                    <TableRow key={consultation.id}>
                                        <TableCell>{consultation.consultation_type}</TableCell>
                                        <TableCell>{consultation.status}</TableCell>
                                        <TableCell>{new Date(consultation.scheduled_at).toLocaleDateString()}</TableCell>
                                        <TableCell>${consultation.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell>${payment.amount}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    ) : (
                        <p>No hay asistencias asociadas a este pago.</p>
                    )
                )}
            </div>
        </ContentLayout>
    );
}
