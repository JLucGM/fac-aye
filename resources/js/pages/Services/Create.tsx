import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Services',
        href: '/services',
    },
    {
        title: 'Create',
        href: '/services/create',
    },
];

export default function Create() {
    const { data, setData, errors, post } = useForm({
        name: '',
        description: '',
        price: 0,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('services.store'), {
            onSuccess: () => {
                console.log("Servicio creado con éxito:", data);
            },
            onError: (err) => {
                console.error("Error al crear el servicio:", err);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Service Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter service name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter service description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <span className="text-red-500">{errors.description}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="price" className="text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter service price"
                            value={data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                        />
                        {errors.price && <span className="text-red-500">{errors.price}</span>}
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Create Service
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
