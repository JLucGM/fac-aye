import AppLayout from '@/layouts/app-layout';
import { ContentLayout } from '@/layouts/content-layout';
import { Consultation, Patient, PaymentMethod, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConsultationsForm from './ConsultationsForm';
import Heading from '@/components/heading';
import { Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/dashboard' },
    { title: 'Consultations', href: '/consultations' },
    { title: 'Editar Consulta', href: '#' },
];

export default function Edit({ consultation, patients, users, services, paymentMethods }: {
    consultation: Consultation & {
        payment?: Array<{
            id: number;
            payment_method_id: number;
            reference: string;
        }>
    },
    patients: Patient[],
    users: User[],
    services: Service[],
    paymentMethods: PaymentMethod[]
}) {
    console.log(consultation)
    const { data, setData, errors, put } = useForm({
        user_id: consultation.user_id,
        patient_id: consultation.patient_id,
        service_id: consultation.services?.map((service: Service) => service.id) ?? [],
        status: consultation.status,
        scheduled_at: consultation.scheduled_at ? new Date(consultation.scheduled_at).toISOString().slice(0, 16) : '',
        notes: consultation.notes || '',
        payment_status: consultation.payment_status || '',
        consultation_type: consultation.consultation_type || '',
        amount: consultation.amount || 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('consultations.update', consultation.id));
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Consulta" />
            <Heading
                title="Editar consulta"
                description="Modifica los detalles de la consulta y la información de pago."
            >
                <Button variant="default" onClick={() => window.open(route('consultationpdf', consultation.id), '_blank')}>
                    <Download />
                    Descargar PDF
                </Button>
            </Heading>

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid grid-cols-1 gap-4">
                    <ConsultationsForm
                        data={{
                            ...data,
                            patient: consultation.patient // ¡Esto es crítico!
                        }}
                        patients={patients}
                        users={users}
                        services={services}
                        setData={setData}
                        errors={errors}
                    />


                </div>
                <Button type="submit" variant="default">
                    Actualizar Consulta
                </Button>
            </form>
        </ContentLayout>
    );
}
