import { ColumnDef } from "@tanstack/react-table";
import { PatientSubscription } from "@/types"; // Asegúrate de que la ruta sea correcta

export const subscriptionColumns: ColumnDef<PatientSubscription>[] = [
    // {
    //     accessorKey: "id",
    //     header: "ID",
    // },
    {
        id: "subscriptionName", // Cambia el id de la columna
        header: "Nombre",
        cell: ({ row }) => {
            const subscription = row.original.subscription; // Accede a la suscripción directamente
            return subscription && subscription.name // Accede directamente a name
                ? subscription.name // Mostrar el nombre de la suscripción
                : 'Sin funcional';
        },
    },
    {
        accessorKey: "start_date",
        header: "Fecha de Inicio",
        cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString('es-ES'),
    },
    {
        accessorKey: "end_date",
        header: "Fecha de Fin",
        cell: ({ row }) => row.original.end_date ? new Date(row.original.end_date).toLocaleDateString('es-ES') : 'Sin fecha',
    },
    {
        accessorKey: "consultations_used",
        header: "Consultas Usadas",
    },
    {
        accessorKey: "consultations_remaining",
        header: "Consultas Restantes",
    },
    {
        accessorKey: "status",
        header: "Estado",
    },
];
