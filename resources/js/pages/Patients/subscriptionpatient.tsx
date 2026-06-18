import { Patient, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import PatientInfo from '@/components/patients-info';
import { MousePointerClick, AlertTriangle } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';

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
        title: 'Renovar funcionales',
        href: '#',
    },
];

export default function Create({ patients, subscriptions }: { patients: Patient[], subscriptions: Subscription[] }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, post, processing } = useForm({
        subscription_id: '',
        patient_id: '',
    });

    const selectedPatient = patients.find(patient => patient.id === Number(data.patient_id));
    const selectedSubscription = subscriptions.find(subscription => subscription.id === Number(data.subscription_id));
    const hasActiveSub = selectedPatient?.subscriptions?.some(s => s.status === 'active');
    const price = selectedSubscription ? parseFloat(selectedSubscription.price?.toString() || '0') : 0;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.patient_id || !data.subscription_id) return;
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        post(route('patients.subscription.update'), {
            onSuccess: () => setShowConfirm(false),
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Renovar funcional" />
            <Heading
                title="Renovar funcional"
                description="Aquí puedes renovar o crear un nuevo funcional al paciente."
            />

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={handleConfirm}
                title="¿Confirmar asignación de funcional?"
                description={
                    <div className="space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm flex gap-2">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Se generará una nueva deuda</p>
                                <p>Esta acción creará una deuda de <strong>${price.toFixed(2)}</strong> en el balance del paciente.</p>
                            </div>
                        </div>
                        {hasActiveSub && (
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-orange-800 text-sm">
                                El paciente tiene un funcional activo actualmente. Será desactivado y reemplazado por el nuevo.
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Paciente:</span>
                            <span className="font-medium">{selectedPatient?.name} {selectedPatient?.lastname}</span>
                            <span className="text-muted-foreground">Funcional:</span>
                            <span className="font-medium">{selectedSubscription?.name}</span>
                            <span className="text-muted-foreground">Tipo:</span>
                            <span className="font-medium capitalize">{selectedSubscription?.type}</span>
                            <span className="text-muted-foreground">Costo:</span>
                            <span className="font-medium">${price.toFixed(2)}</span>
                            {selectedSubscription?.consultations_allowed && (
                                <>
                                    <span className="text-muted-foreground">Consultas incluidas:</span>
                                    <span className="font-medium">{selectedSubscription.consultations_allowed}</span>
                                </>
                            )}
                        </div>
                    </div>
                }
                confirmButtonText="Sí, asignar funcional"
                confirmVariant="default"
                processing={processing}
                icon="warning"
            />

            <div className="grid grid-cols-3 gap-4">
                <form className="col-span-2 flex flex-col gap-4" onSubmit={submit}>
                    <div className="mt-4">
                        <Label htmlFor="patient_id">Paciente</Label>
                        <Select
                            id="patient_id"
                            options={[
                                { value: '', label: 'Sin paciente' },
                                ...patients.map(patient => ({
                                    value: patient.id,
                                    label: `${patient.name} ${patient.lastname} ( C.I: ${patient.identification} )`
                                }))
                            ]}
                            value={data.patient_id
                                ? { value: data.patient_id, label: patients.find(s => s.id === data.patient_id)?.name || '' }
                                : { value: '', label: 'Sin paciente' }
                            }
                            onChange={(selected) => setData('patient_id', selected?.value || null)}
                            isClearable={false}
                            className="mt-1"
                        />
                        <Label className='text-gray-500 text-sm' htmlFor="patient_id">Solo se mostrarán los pacientes sin funcional o renovación de funcional</Label>
                        <InputError message={errors.patient_id} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="subscription_id">Funcionales</Label>
                        <Select
                            id="subscription_id"
                            options={[
                                { value: '', label: 'Sin Funcionales' },
                                ...subscriptions.map(subscription => ({
                                    value: subscription.id,
                                    label: `${subscription.name} (${subscription.type})`
                                }))
                            ]}
                            value={data.subscription_id
                                ? { value: data.subscription_id, label: subscriptions.find(s => s.id === data.subscription_id)?.name || '' }
                                : { value: '', label: 'Sin Funcionales' }
                            }
                            onChange={(selected) => setData('subscription_id', selected?.value || null)}
                            isClearable={false}
                            className="mt-1"
                        />
                        <InputError message={errors.subscription_id} className="mt-2" />
                    </div>

                    <Button variant={"default"} type="submit" disabled={!data.patient_id || !data.subscription_id}>
                        Revisar y Confirmar
                    </Button>
                </form>

                <div className="mt-4">
                    {selectedPatient ? (
                        <div className="">
                            <PatientInfo patient={selectedPatient} />
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <MousePointerClick className="mx-auto mb-2 text-gray-600" size={48} />
                            <p className="text-gray-500">Seleccione un paciente para ver sus datos</p>
                        </div>
                    )}

                    {selectedSubscription && (
                        <div className=" mt-4">
                            <h3 className="text-base font-medium mb-0.5">Datos de la Suscripción</h3>
                            <div className="space-y-2">
                                <p><strong>Nombre:</strong> {selectedSubscription.name}</p>
                                <p className='capitalize'><strong>Tipo:</strong> {selectedSubscription.type}</p>
                                <p><strong>Precio:</strong> ${price.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}