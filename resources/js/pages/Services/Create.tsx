import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ServicesForm from './ServicesForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContentLayout from '@/layouts/content-layout';

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
                // toast("Servicio creado con éxito.");
            },
            onError: (err) => {
                console.error("Error al crear el servicio:", err);
                // toast("Error al crear el servicio.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
           
           <ContentLayout>

                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <ServicesForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button
                        variant={"default"}
                    >
                        Create Service
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}
