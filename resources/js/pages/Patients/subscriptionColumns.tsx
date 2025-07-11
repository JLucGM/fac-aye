import { ColumnDef } from "@tanstack/react-table";
import { PatientSubscription, Subscription } from "@/types"; // Asegúrate de que la ruta sea correcta

export const subscriptionColumns: ColumnDef<PatientSubscription>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "subscription_id",
        header: "ID de Suscripción",
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
