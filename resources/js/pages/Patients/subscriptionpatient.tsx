import { Doctor, Patient, Subscription, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import Heading from '@/components/heading';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

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
    const { data, setData, errors, post } = useForm({
        subscription_id: '', // Inicializa el campo de Funcionales
        patient_id: '', // Inicializa el campo de Funcionales
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.patient_id || !data.subscription_id) {
            console.error("Se requiere patient_id y subscription_id para actualizar la suscripción.");
            return;
        }

        post(route('patients.subscription.update'), {
            onSuccess: () => {
                console.log("Suscripción actualizada exitosamente");
            },
            onError: (err) => {
                console.error("Error al actualizar la suscripción:", err);
            },
        });
    };


    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Renovar funcional" />
            <Heading
                title="Renovar funcional"
                description="Aquí puedes renovar o crear un nuevo funcional al paciente."
            />
            <form className="flex flex-col gap-4" onSubmit={submit}>

                <div className="mt-4">
                    <Label htmlFor="patient_id">Paciente</Label>
                    <Select
                        id="patient_id"
                        options={[
                            { value: '', label: 'Sin paciente' },  // Nueva opción explícita
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
                        isClearable={false}  // Deshabilitamos clearable porque ya tenemos nuestra opción explícita
                        className="mt-1"
                    />
                    <Label className='text-gray-500 text-sm' htmlFor="patient_id">Solo se mostraran los paciente sin funcional o renovación de funcional</Label>

                    <InputError message={errors.patient_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="subscription_id">Funcionales</Label>
                    <Select
                        id="subscription_id"
                        options={[
                            { value: '', label: 'Sin Funcionales' },  // Nueva opción explícita
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
                        isClearable={false}  // Deshabilitamos clearable porque ya tenemos nuestra opción explícita
                        className="mt-1"
                    />

                    <InputError message={errors.subscription_id} className="mt-2" />
                </div>

                <Button variant={"default"} onClick={submit}>
                    Actualizar Suscripción
                </Button>

            </form>
        </ContentLayout>
    );
}
