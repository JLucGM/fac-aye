import AppLayout from '@/layouts/app-layout';
import ContentLayout from '@/layouts/content-layout';
import { Patient, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PatientsForm from './PatientsForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Patients',
        href: '/patients',
    },
    {
        title: 'Edit Patient', // Updated title for clarity
        href: '#',
    },
];

export default function Edit({ patient }: { patient: Patient }) {
    console.log("Edit patient page loaded with patient data:", patient);
    const { data, setData, errors, put, recentlySuccessful } = useForm({
        name: patient.name,
        lastname: patient.lastname ?? '', // Fix: Provide an empty string if lastname is undefined
        email: patient.email,
        phone: patient.phone ?? '',       // Fix: Provide an empty string if phone is undefined
        // Handle 'patient.birthdate' possibly undefined.
        // Check if patient.birthdate exists before calling split, otherwise provide an empty string.
        birthdate: patient.birthdate ? patient.birthdate.split('T')[0] : '', // Extract only the date part
        identification: patient.identification,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form data before submission:", data); // Check that data is updating

        // Address 'Argument of type 'Router' is not assignable to parameter of type 'string'.'
        // This error typically means TypeScript is misinterpreting the global 'route' function (from Ziggy.js)
        // as a 'Router' object. To work around this, we explicitly cast 'window.route'
        // to a function type that returns a string.
        const routeFn = (name: string, params?: object | number) => (window as any).route(name, params);

        // Ensure you pass the correct ID to the update route, which is patient.id
        put(routeFn('patients.update', patient), {
            onSuccess: () => {
                console.log("Paciente actualizado con éxito:", data);
                // toast("Paciente actualizado con éxito."); // Uncomment if you have sonner setup
            },
            onError: (err) => {
                console.error("Error al actualizar el paciente:", err);
                // toast("Error al actualizar el paciente."); // Uncomment if you have sonner setup
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Patient" /> {/* Updated Head title */}

            <ContentLayout>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <PatientsForm
                        data={data}
                        setData={setData}
                        errors={errors}
                    />

                    <Button variant={"default"}>
                        Update Patient {/* Button text remains "Update Patient" */}
                    </Button>
                </form>
            </ContentLayout>
        </AppLayout>
    );
}