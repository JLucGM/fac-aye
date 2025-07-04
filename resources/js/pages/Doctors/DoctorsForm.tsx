import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateDoctorFormData, CreatePatientFormData } from "@/types";

type DoctorsFormProps = {
    data: CreateDoctorFormData;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string;
        lastname?: string;
        email?: string;
        phone?: string;
        birthdate?: string;
        identification?: string; // Optional field for identification errors
        address?: string; // Optional field for address errors
        specialty?: string; // Optional field for specialty errors
    };
};

export default function DoctorsForm({ data, setData, errors }: DoctorsFormProps) {
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
                <Label className="my-2 block font-semibold text-gray-700" htmlFor="specialty">Especialidad</Label>
                <Input
                    id="specialty"
                    type="text"
                    name="specialty"
                    value={data.specialty}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('specialty', e.target.value)}
                />
                <InputError message={errors.specialty} className="mt-2" />
            </div>

        </>
    );
}