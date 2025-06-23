import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Consultation, CreateConsultationFormData, Patient, PaymentMethod, Service, User, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';
import ConsultationsForm from './ConsultationsForm';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Consultations',
        href: '/consultations',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function Create({ patients, users, services, paymentMethods }: {
    patients: Patient[],
    users: User[],
    services: Service[],
    paymentMethods: PaymentMethod[],
}) {
    // console.log("Create consultation page loaded with patients:", patients);
    // console.log("Create consultation page loaded with users:", users);
    // console.log("Create consultation page loaded with services:", services);

    const { data, setData, errors, post } = useForm<CreateConsultationFormData>({
        user_id: users[0].id,
        patient_id: patients[0].id,
        service_id: [],
        status: '',
        scheduled_at: '',
        consultation_type: '', // Uncomment if you want to include consultation type
        // completed_at: '',
        notes: '',
        payment_status: '',
        amount: 0,

        // campo de pago
        payment_method_id: paymentMethods.length > 0 ? Number(paymentMethods[0].id) : null, // Cambia a null si no hay métodos de pago
        reference: '',
        // paid_at: new Date().toISOString().split('T')[0],
    });
    // console.log("Create consultation page loaded with initial data:", data);
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("Submitting consultation with data:", data);
        e.preventDefault();
        post(route('consultations.store'), {
            onSuccess: () => {
                // console.log("Paciente creado con éxito:", data);
                // toast("Paciente creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el paciente:", err);
                // toast("Error al crear el paciente.");
            },
        });
    };

    const paymentMethodOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.name
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />

            <ContentLayout>
                <Heading
                    title="Crear consulta"
                    description="Aquí puedes crear una nueva consulta para un paciente."
                >

                </Heading>

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="">
                            <ConsultationsForm
                                data={data}
                                patients={patients}
                                users={users}
                                services={services}
                                setData={setData}
                                errors={errors}
                            />
                        </div>

                        <div className="">
                            <h1 className='text-xl'>pago</h1>
                            <div>
                                <Label htmlFor="payment_method_id">Método de Pago</Label>
                                <Select
                                    id="payment_method_id"
                                    options={paymentMethodOptions}
                                    value={paymentMethodOptions.find(option => option.value === data.payment_method_id) || null}
                                    onChange={selectedOption => setData('payment_method_id', selectedOption ? selectedOption.value : null)}
                                    isSearchable
                                    placeholder="Selecciona un método de pago..."
                                    className="rounded-md mt-1 block w-full"
                                />
                                <InputError message={errors.payment_method_id} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="reference">Referencia</Label>
                                <Input
                                    id="reference"
                                    type="text"
                                    name="reference"
                                    value={data.reference}
                                    className="mt-1 block w-full"
                                    onChange={e => setData('reference', e.target.value)}
                                />
                                <InputError message={errors.reference} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <Button
                        variant={"default"}
                    >
                        Crear Consulta
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
