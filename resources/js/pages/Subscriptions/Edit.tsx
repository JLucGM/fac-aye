import { ContentLayout } from '@/layouts/content-layout';
import { Subscription, SuscriptionFormData, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import SuscriptionsForm from './SuscriptionsForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';
import { Info } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Funcionales',
        href: '/subscriptions',
    },
    {
        title: 'Editar Funcional',
        href: '#',
    },
];

export default function Edit({ subscription }: { subscription: Subscription }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, put, processing } = useForm<SuscriptionFormData>({
        name: subscription.name,
        description: subscription.description ?? '',
        price: subscription.price,
        type: subscription.type as 'semanal' | 'mensual' | 'anual',
        consultations_allowed: subscription.consultations_allowed ?? 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        put(routeFn('subscriptions.update', subscription), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Funcional" />
            <Heading
                title="Editar Funcional"
                description="Aquí puedes editar una Funcional existente."
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={handleConfirm}
                title="¿Confirmar actualización del plan funcional?"
                description={
                    <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 text-sm flex gap-2">
                            <Info className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Se actualizará el plan</p>
                                <p>Este cambio afectará a las futuras asignaciones de este plan a los pacientes. Los pacientes con este plan activo no se verán afectados retroactivamente.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Nombre actual:</span>
                            <span className="font-medium">{subscription.name}</span>
                            <span className="text-muted-foreground">Nuevo nombre:</span>
                            <span className="font-medium">{data.name || '(sin nombre)'}</span>
                            <span className="text-muted-foreground">Precio actual:</span>
                            <span className="font-medium">${Number(subscription.price).toFixed(2)}</span>
                            <span className="text-muted-foreground">Nuevo precio:</span>
                            <span className="font-medium">${Number(data.price).toFixed(2)}</span>
                            {Number(data.price) !== Number(subscription.price) && (
                                <div className="col-span-2 text-amber-600 text-xs">
                                    Nota: el cambio de precio solo aplica a nuevas asignaciones, no a las suscripciones activas actuales.
                                </div>
                            )}
                        </div>
                    </div>
                }
                confirmButtonText="Sí, actualizar plan"
                processing={processing}
                icon="info"
            />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <SuscriptionsForm
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <Button variant={"default"}>
                    Revisar y Confirmar
                </Button>
            </form>
        </ContentLayout>
    );
}