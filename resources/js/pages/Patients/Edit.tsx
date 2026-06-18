import { ContentLayout } from '@/layouts/content-layout';
import { Doctor, Patient, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
        title: 'Editar Paciente',
        href: '#',
    },
];

export default function Edit({ patient, doctors, subscriptions }: { patient: Patient, doctors: Doctor[], subscriptions: Subscription[] }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const activeSubscription = patient.subscriptions?.find(sub => sub.status === 'active') || null;

    const { data, setData, errors, put, processing } = useForm({
        name: patient.name,
        lastname: patient.lastname ?? '',
        email: patient.email,
        phone: patient.phone ?? '',
        birthdate: patient.birthdate ? patient.birthdate.split('T')[0] : '',
        identification: patient.identification,
        address: patient.address ?? '',
        doctor_id: patient.doctor_id ?? null,
        subscription_id: activeSubscription ? activeSubscription.subscription_id : null,
    });

    const selectedSubscription = subscriptions.find(s => s.id === Number(data.subscription_id));
    const hasSubscriptionChange = !!data.subscription_id;
    const price = selectedSubscription ? parseFloat(selectedSubscription.price?.toString() || '0') : 0;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        if (hasSubscriptionChange) {
            setShowConfirm(true);
        } else {
            put(routeFn('patients.update', patient));
        }
    };

    const handleConfirm = () => {
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('patients.update', patient), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Paciente" />
            <Heading
                title="Editar Paciente"
                description="Aquí puedes editar un paciente existente."
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={handleConfirm}
                title="¿Confirmar actualización del paciente?"
                description={
                    <div className="space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm flex gap-2">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Se asignará un funcional</p>
                                <p>Se actualizará el paciente y se asignará el funcional <strong>{selectedSubscription?.name}</strong>.</p>
                                {activeSubscription ? (
                                    <p className="mt-1">El funcional actual <strong>{activeSubscription.subscription?.name}</strong> será desactivado y se creará uno nuevo con una <strong>deuda de ${price.toFixed(2)}</strong>.</p>
                                ) : (
                                    <p className="mt-1">Se generará una <strong>deuda de ${price.toFixed(2)}</strong> en el balance del paciente.</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Paciente:</span>
                            <span className="font-medium">{data.name} {data.lastname}</span>
                            <span className="text-muted-foreground">Nuevo funcional:</span>
                            <span className="font-medium">{selectedSubscription?.name}</span>
                            <span className="text-muted-foreground">Costo:</span>
                            <span className="font-medium">${price.toFixed(2)}</span>
                        </div>
                    </div>
                }
                confirmButtonText="Sí, actualizar paciente"
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
                    {hasSubscriptionChange ? 'Revisar y Confirmar' : 'Actualizar Paciente'}
                </Button>
            </form>
        </ContentLayout>
    );
}