import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceFormData } from "@/types";

type ServicesFormProps = {
    data: ServiceFormData;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string;
        description?: string;
        price?: string;
        is_courtesy?: string;
    };
};

export default function ServicesForm({ data, setData, errors }: ServicesFormProps) {
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
                    onChange={(e) => setData('price', e.target.value)}
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

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="is_courtesy"
                    name="is_courtesy"
                    checked={data.is_courtesy || false}
                    onChange={(e) => setData('is_courtesy', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_courtesy">¿Es de cortesía? (gratis)</Label>
                <InputError message={errors.is_courtesy} className="mt-2" />
            </div>
        </>
    );
}