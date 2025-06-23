import React from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateRoleFormData } from '@/types';

type RolesFormProps = {
    data: CreateRoleFormData;
    setData: (key: string, value: any) => void;
    permissions: { name: string, description?: string }[];
    errors: {
        name?: string;
        permissions?: string;
    };
};

export default function RolesForm({ data, permissions, setData, errors }: RolesFormProps) {
    const handleCheckboxChange = (permissionName: string, checked: boolean) => {
        let newPermissions = [...data.permissions];
        if (checked) {
            if (!newPermissions.includes(permissionName)) {
                newPermissions.push(permissionName);
            }
        } else {
            newPermissions = newPermissions.filter(p => p !== permissionName);
        }
        setData('permissions', newPermissions);
    };

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

            <div className="mt-4">
                <Label>Lista de Permisos</Label>
                {permissions.map((permission) => (
                    <div key={permission.name} className="flex items-center mt-2">
                        <Checkbox
                            id={permission.name}
                            checked={data.permissions.includes(permission.name)}
                            onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                    handleCheckboxChange(permission.name, checked);
                                }
                            }}
                        />
                        <Label htmlFor={permission.name} className="ml-2 cursor-pointer">
                            {permission.description}
                        </Label>
                    </div>
                ))}
                <InputError message={errors.permissions} className="mt-2" />
            </div>
        </>
    );
}
