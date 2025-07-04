import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePatientFormData, Doctor } from "@/types";
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
    };
      doctors: Doctor[];
};

export default function PatientsForm({ data, setData, errors, doctors }: ServicesFormProps) {

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.id,
        label: `${doctor.name} ${doctor.lastname}` // Asegúrate de que estos campos existan en tu objeto Doctor
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

        </>
    );
}