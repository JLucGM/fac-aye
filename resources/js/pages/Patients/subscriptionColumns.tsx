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
        id: "subscriptionPrice", // Cambia el id de la columna
        header: "Precio",
        cell: ({ row }) => {
            const subscription = row.original.subscription; // Accede a la suscripción directamente
            return subscription && subscription.price // Accede directamente a price
                ? subscription.price // Mostrar el precio de la suscripción
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
        cell: ({ row }) => {
            const status = row.original.status;
            const statusColors: { [key: string]: string } = {
                active: "text-green-500 capitalize",
                inactive: "text-red-500 capitalize",
                pending: "text-yellow-500 capitalize",
            };
            return <span className={statusColors[status] || ''}>{status}</span>;
        },
    },
    {
        accessorKey: "payment_status",
        header: "Estado de Pago",
    },
];
