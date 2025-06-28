import React from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateUserFormData } from '@/types';

type UsersFormProps = {
    data: CreateUserFormData;
    setData: (key: string, value: any) => void;
    errors: {
        name?: string;
        lastname?: string;
        email?: string;
        active?: string; // Cambia esto a string
        phone?: string;
        password?: string;
        permissions?: string[];
        identification?: string; // Asegúrate de que sea string
    };
};


export default function UsersForm({ data, setData, errors }: UsersFormProps) {

    return (
        <>
            <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                    id="lastname"
                    type="text"
                    name="lastname"
                    value={data.lastname || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('lastname', e.target.value)}
                />
                <InputError message={errors.lastname} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="identification">Identificación</Label>
                <Input
                    id="identification"
                    type="text"
                    name="identification"
                    value={data.identification || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('identification', e.target.value)} // Asegúrate de que se esté configurando correctamente
                />
                <InputError message={errors.identification} className="mt-2" />
            </div>


            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                    id="phone"
                    type="text"
                    name="phone"
                    value={data.phone || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('phone', e.target.value)}
                />
                <InputError message={errors.phone} className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="active"
                    name="active"
                    checked={data.active || false} // Asegúrate de que sea booleano
                    className="mt-1 blocks"
                    onCheckedChange={(checked) => setData('active', checked)}
                />
                <Label htmlFor="active">Activo</Label>
                <InputError message={errors.active} className="mt-2" />
            </div>

        </>
    );
}
