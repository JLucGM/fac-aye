import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/layouts/content-layout';
import { PatientResource, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DataTable } from '../../components/data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
    {
        title: 'Listado de Pacientes',
        href: '/patients',
    },
];

interface IndexProps {
    patients: PaginatedData<PatientResource>;
    filters: {
        search?: string;
    };
}

export default function Index({ patients, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(search, 500);
    const [birthdayPatients, setBirthdayPatients] = useState<PatientResource[]>([]);

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
        const birthdayList = patients.data.filter(patient => {
            if (patient.birthdate) {
                const birthDateObj = new Date(patient.birthdate);
                const birthday = birthDateObj.toLocaleDateString('en-CA', { month: '2-digit', day: '2-digit' });
                return birthday === today;
            }
            return false;
        });
        setBirthdayPatients(birthdayList);
    }, [patients.data]);

    useEffect(() => {
        if (debouncedSearch !== (filters.search ?? '')) {
            router.get(
                route('patients.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <ContentLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de Pacientes" />
            <Heading
                title="Listado de Pacientes"
                description="Gestiona tus pacientes."
            >
                <div className="flex justify-end gap-4">
                    <Button asChild variant={'outline'}>
                        <Link href={route('subscriptionpatient.store')}>
                            Actualizar funcional
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={route('patients.create')}>
                            Crear paciente
                        </Link>
                    </Button>
                </div>
            </Heading>

            {birthdayPatients.length > 0 && (
                <div className="mb-4 p-4 border border-yellow-300 bg-yellow-100 rounded">
                    <h2 className="font-semibold text-lg">¡Feliz Cumpleaños a nuestros pacientes!</h2>
                    <ul>
                        {birthdayPatients.map(patient => (
                            <li key={patient.id}>
                                {patient.full_name} - {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('es-CA', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Fecha no disponible'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <DataTable
                columns={columns}
                data={patients.data}
                meta={patients.meta}
                onSearch={setSearch}
                initialSearch={search}
                searchPlaceholder="Buscar por nombre, apellido o identificación..."
            />
        </ContentLayout>
    );
}
