import InputError from "@/components/input-error";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePaymentMethodFormData, PaymentMethod } from "@/types";
import { Check } from "lucide-react";

type PaymentMethodsFormProps = {
    data: CreatePaymentMethodFormData;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string; // Asegúrate de que sea string
        description?: string; // Asegúrate de que sea string
        active?: string; // Cambiado a string para los errores
    };
};

export default function PaymentMethodsForm({ data, setData, errors }: PaymentMethodsFormProps) {
    return (
        <>
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name || ''} // Asegúrate de que sea una cadena
                    className="mt-1 block w-full"
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    type="text"
                    name="description"
                    value={data.description || ''} // Asegúrate de que sea una cadena
                    className="mt-1 block w-full"
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="active"
                    name="active"
                    checked={data.active || false} // Asegúrate de que sea booleano
                    className="mt-1 blocks"
                    onCheckedChange={(checked) => setData('active', checked)}
                />
                <Label htmlFor="active">Active</Label>
                {/* <Input
                    id="active"
                    type="checkbox"
                    name="active"
                    checked={data.active || false} // Asegúrate de que sea booleano
                    className="mt-1 block w-full"
                    onChange={(e) => setData('active', e.target.checked)}
                /> */}
                <InputError message={errors.active} className="mt-2" />
            </div>
        </>
    );
}
