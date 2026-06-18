import { Doctor, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import PatientsForm from './PatientsForm';
import Heading from '@/components/heading';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Pacientes',
        href: '/patients',
    },
    {
        title: 'Crear Paciente',
        href: '#',
    },
];

export default function Create({ doctors, subscriptions }: { doctors: Doctor[], subscriptions: Subscription[] }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        identification: '',
        address: '',
        doctor_id: doctors.length > 0 ? doctors[0].id : null,
        subscription_id: '',
    });

    const selectedSubscription = subscriptions.find(s => s.id === Number(data.subscription_id));
    const hasSubscription = !!data.subscription_id;
    const price = selectedSubscription ? parseFloat(selectedSubscription.price?.toString() || '0') : 0;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hasSubscription) {
            setShowConfirm(true);
        } else {
            post(route('patients.store'));
        }
    };

    const handleConfirm = () => {
        post(route('patients.store'), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Paciente" />
            <Heading
                title="Crear Paciente"
                description="Aquí puedes crear un nuevo paciente."
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={handleConfirm}
                title="¿Confirmar creación del paciente?"
                description={
                    <div className="space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm flex gap-2">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Se asignará un funcional</p>
                                <p>Se creará el paciente con el funcional <strong>{selectedSubscription?.name}</strong> y se generará una <strong>deuda de ${price.toFixed(2)}</strong> en su balance.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Paciente:</span>
                            <span className="font-medium">{data.name} {data.lastname}</span>
                            <span className="text-muted-foreground">Funcional:</span>
                            <span className="font-medium">{selectedSubscription?.name}</span>
                            <span className="text-muted-foreground">Costo del funcional:</span>
                            <span className="font-medium">${price.toFixed(2)}</span>
                        </div>
                    </div>
                }
                confirmButtonText="Sí, crear paciente"
                processing={processing}
                icon="warning"
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <PatientsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    doctors={doctors}
                    subscriptions={subscriptions}
                />

                <Button variant={"default"}>
                    {hasSubscription ? 'Revisar y Confirmar' : 'Crear Paciente'}
                </Button>
            </form>
        </ContentLayout>
    );
}