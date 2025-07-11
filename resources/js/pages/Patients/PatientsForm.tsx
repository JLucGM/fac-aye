import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePatientFormData, Doctor, Subscription } from "@/types";
import Select from 'react-select'

type ServicesFormProps = {
    data: CreatePatientFormData;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string;
        lastname?: string;
        email?: string;
        phone?: string;
        birthdate?: string;
        identification?: string; // Optional field for identification errors
        address?: string; // Optional field for address errors
        doctor_id?: string; // Optional field for doctor selection errors
        subscription_id?: string; // Optional field for subscription selection errors
        patientSubscription?: string; // Optional field for patient subscription errors     
    };
    doctors: Doctor[];
    subscriptions: Subscription[]; // Agregar las suscripciones
    // patientSubscription?: PatientSubscription; // Suscripción actual del paciente

};

export default function PatientsForm({ data, setData, errors, doctors, subscriptions }: ServicesFormProps) {

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.id,
        label: `${doctor.name} ${doctor.lastname}` // Asegúrate de que estos campos existan en tu objeto Doctor
    }));

    const subscriptionOptions = subscriptions.map(subscription => ({
        value: subscription.id,
        label: subscription.name // Asegúrate de que el campo 'name' exista
    }));

    return (
        <>
            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="identification">Cédula de identidad</Label>
                <Input
                    id="identification"
                    type="text"
                    name="identification"
                    value={data.identification}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('identification', e.target.value)}
                />
                <InputError message={errors.identification} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="lastname">Apellido</Label>
                <Input
                    id="lastname"
                    type="text"
                    name="lastname"
                    value={data.lastname}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('lastname', e.target.value)}
                />
                <InputError message={errors.lastname} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="phone">Teléfono</Label>
                <Input
                    id="phone"
                    type="text"
                    name="phone"
                    value={data.phone}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('phone', e.target.value)}
                />
                <InputError message={errors.phone} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="address">Dirección</Label>
                <Input
                    id="address"
                    type="text"
                    name="address"
                    value={data.address}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('address', e.target.value)}
                />
                <InputError message={errors.address} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="birthdate">Fecha de nacimiento</Label>
                <Input
                    id="birthdate"
                    type="date"
                    name="birthdate"
                    value={data.birthdate}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('birthdate', e.target.value)}
                />
                <InputError message={errors.birthdate} className="mt-2" />
            </div>

            <div>
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="doctor_id">Medico tratante</Label>
                <Select
                    id="doctor_id"
                    options={doctorOptions}
                    value={doctorOptions.find(option => option.value === data.doctor_id) || null}
                    onChange={(selectedOption) =>
                        setData('doctor_id', selectedOption ? selectedOption.value : null)
                    }
                    isSearchable
                    placeholder="Selecciona un doctor..."
                    className="rounded-md"
                />
                <InputError message={errors.doctor_id} className="mt-2" />
            </div>

            <div className="mt-4">
                <Label htmlFor="subscription_id">Suscripción (Opcional)</Label>
                <Select
                    id="subscription_id"
                    options={[
                        { value: '', label: 'Sin suscripción' },  // Nueva opción explícita
                        ...subscriptions.map(subscription => ({
                            value: subscription.id,
                            label: `${subscription.name} (${subscription.type})`
                        }))
                    ]}
                    value={data.subscription_id
                        ? { value: data.subscription_id, label: subscriptions.find(s => s.id === data.subscription_id)?.name || '' }
                        : { value: '', label: 'Sin suscripción' }
                    }
                    onChange={(selected) => setData('subscription_id', selected?.value || null)}
                    isClearable={false}  // Deshabilitamos clearable porque ya tenemos nuestra opción explícita
                    className="mt-1"
                />
                <InputError message={errors.subscription_id} className="mt-2" />
            </div>


        </>
    );
}