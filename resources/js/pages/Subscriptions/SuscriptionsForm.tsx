import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuscriptionFormData } from "@/types";
import { Select } from "@/components/ui/select";

type SuscriptionsFormProps = {
    data: SuscriptionFormData;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string;
        description?: string;
        price?: string;
        type?: string;
        consultations_allowed?: string;
    };
};

export default function SuscriptionsForm({ data, setData, errors }: SuscriptionsFormProps) {
    return (
        <>
            <div>
                <Label htmlFor="name">Nombre</Label>
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
                <Label htmlFor="price">Precio</Label>
                <Input
                    id="price"
                    type="number"
                    name="price"
                    value={data.price}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('price', parseFloat(e.target.value))}
                />
                <InputError message={errors.price} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                    id="description"
                    type="text"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="type">Tipo de Funcional</Label>
                <select
                    id="type"
                    name="type"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value as 'semanal' | 'mensual' | 'anual')}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona un tipo</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="anual">Anual</option>
                </select>

                <InputError message={errors.type} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="consultations_allowed">Consultas Permitidas</Label>
                <Input
                    id="consultations_allowed"
                    type="number"
                    name="consultations_allowed"
                    value={data.consultations_allowed}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('consultations_allowed', parseInt(e.target.value))}
                />
                <InputError message={errors.consultations_allowed} className="mt-2" />
            </div>
        </>
    );
}
