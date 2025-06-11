import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Patient } from "@/types";

type ServicesFormProps = {
    data: Patient;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string;
        lastname?: string;
        email?: string;
        phone?: string;
        birthdate?: string;
        identification?: string; // Optional field for identification errors

    };
};
export default function PatientsForm({ data, setData, errors }: ServicesFormProps) {
    return (
        <>
            <div>
                <Label htmlFor="identification">identification</Label>
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
                <Label htmlFor="name">name</Label>
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
                <Label htmlFor="lastname">last name</Label>
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
                <Label htmlFor="email">email</Label>
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
                <Label htmlFor="phone">phone</Label>
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
                <Label htmlFor="birthdate">birth date</Label>
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

        </>
    );
}