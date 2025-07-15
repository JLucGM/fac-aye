import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppContent } from '@/components/app-content';
import { ContentLayout } from '@/layouts/content-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Configuraciones generales',
        href: '/settings/general',
    },
];

type MediaItem = {
    collection_name: string;
    original_url: string;
    name: string;
    // Agrega otros campos que necesites
};

type Settings = {
    name: string;
    rif: string;
    direction: string;
    phone: string;
    email: string;
    instagram: string;
    media: MediaItem[]; // Asegúrate de que media sea un array de MediaItem
    logo: File[] | string | null;
    signature: File[] | string | null;
};

type FormData = {
    name: string;
    rif: string;
    direction: string;
    phone: string;
    email: string;
    instagram: string;
    logo: File[] | string | null; // Permite múltiples tipos
    signature: File[] | string | null;
};

export default function Index({ settings }: { settings: Settings }) {
    const logo = settings.media.find((mediaItem: MediaItem) => mediaItem.collection_name === 'logo');
    const signature = settings.media.find((mediaItem: MediaItem) => mediaItem.collection_name === 'signature');

    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm<FormData>({
        name: settings.name,
        rif: settings.rif,
        direction: settings.direction,
        phone: settings.phone,
        email: settings.email,
        instagram: settings.instagram,
        logo: settings.logo || null, // Inicializa como null o string vacío
        signature: settings.logo || null, // Inicializa como null o string vacío
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('settings.update', settings), {
            onSuccess: () => reset(),
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuraciones generales" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Actualización de las configuraciones" description="" />
                    <form onSubmit={submit} className="space-y-6">

                        {logo && (
                            <div className="flex justify-center">

                                <img
                                    src={logo.original_url} // URL del logo
                                    alt={logo.name} // Nombre del logo
                                    className="w-auto h-44 object-cover rounded-xl"
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="logo">Logo</Label>
                            <Input
                                id="logo"
                                type="file"
                                name="logo"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setData('logo', Array.from(e.target.files));
                                    } else {
                                        setData('logo', null);
                                    }
                                }}
                                accept="image/*" // Solo acepta imágenes
                            />
                            <InputError message={errors.logo} className="mt-2" />
                        </div>

                        {signature && (
                            <div className="flex justify-center">

                                <img
                                    src={signature.original_url} // URL del signature
                                    alt={signature.name} // Nombre del signature
                                    className="w-auto h-44 object-cover rounded-xl"
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="signature">Firma</Label>
                            <Input
                                id="signature"
                                type="file"
                                name="signature"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setData('signature', Array.from(e.target.files));
                                    } else {
                                        setData('signature', null);
                                    }
                                }}
                                accept="image/*" // Solo acepta imágenes
                            />
                            <InputError message={errors.signature} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre de la empresa</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Current password"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rif">R.I.F</Label>
                            <Input
                                id="rif"
                                value={data.rif}
                                onChange={(e) => setData('rif', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.rif} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="direction">Dirección</Label>
                            <Input
                                id="direction"
                                value={data.direction}
                                onChange={(e) => setData('direction', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.direction} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Télefono</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                value={data.instagram}
                                onChange={(e) => setData('instagram', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.instagram} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </ContentLayout>
    );
}
