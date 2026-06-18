import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
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
        title: 'Crear Funcional',
        href: '/subscriptions/create',
    },
];

export default function Create() {
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, post, processing } = useForm({
        name: '',
        description: '',
        price: 0,
        type: 'semanal' as 'semanal',
        consultations_allowed: 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        post(route('subscriptions.store'), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Funcional" />
            <Heading
                title="Crear Funcional"
                description="Aquí puedes crear una nueva Funcional."
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={handleConfirm}
                title="¿Confirmar creación del plan funcional?"
                description={
                    <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 text-sm flex gap-2">
                            <Info className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Se creará un nuevo plan</p>
                                <p>Los pacientes que contraten este plan generarán una deuda por el costo del funcional en su balance.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Nombre:</span>
                            <span className="font-medium">{data.name || '(sin nombre)'}</span>
                            <span className="text-muted-foreground">Precio:</span>
                            <span className="font-medium">${Number(data.price).toFixed(2)}</span>
                            <span className="text-muted-foreground">Tipo:</span>
                            <span className="font-medium capitalize">{data.type}</span>
                            <span className="text-muted-foreground">Consultas permitidas:</span>
                            <span className="font-medium">{data.consultations_allowed}</span>
                        </div>
                    </div>
                }
                confirmButtonText="Sí, crear plan"
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