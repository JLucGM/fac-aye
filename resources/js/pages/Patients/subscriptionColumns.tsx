import { ColumnDef } from "@tanstack/react-table";
import { PatientSubscription } from "@/types";
import ReverseSubscriptionDialog from "@/components/patients/ReverseSubscriptionDialog";
import ReactivateSubscriptionDialog from "@/components/patients/ReactivateSubscriptionDialog";

export const subscriptionColumns = (patientSlug?: string): ColumnDef<PatientSubscription>[] => [
    {
        id: "subscriptionName",
        header: "Nombre",
        cell: ({ row }) => {
            const subscription = row.original.subscription;
            return subscription && subscription.name
                ? subscription.name
                : 'Sin funcional';
        },
    },
    {
        id: "subscriptionPrice",
        header: "Precio",
        cell: ({ row }) => {
            const subscription = row.original.subscription;
            return subscription && subscription.price
                ? `$${parseFloat(subscription.price).toFixed(2)}`
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
        header: "Asistencias Usadas",
    },
    {
        accessorKey: "consultations_remaining",
        header: "Asistencias Restantes",
    },
    {
        accessorKey: "amount_paid",
        header: "Monto Pagado",
        cell: ({ row }) => {
            const amountPaid = parseFloat(row.original.amount_paid?.toString() || '0');
            return `$${amountPaid.toFixed(2)}`;
        },
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
                cancelled: "text-gray-500 capitalize",
            };
            return <span className={statusColors[status] || ''}>{status}</span>;
        },
    },
    {
        accessorKey: "payment_status",
        header: "Estado de Pago",
        cell: ({ row }) => {
            const status = row.original.payment_status;
            const colors: { [key: string]: string } = {
                pagado: "text-green-500 capitalize",
                pendiente: "text-yellow-500 capitalize",
                parcial: "text-orange-500 capitalize",
            };
            return <span className={colors[status] || ''}>{status}</span>;
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const sub = row.original;
            if (!patientSlug) return null;

            const canReverse = sub.status !== 'cancelled';
            const canReactivate = sub.status !== 'active' && (sub.consultations_remaining ?? 0) > 0;

            return (
                <div className="flex gap-1">
                    {canReverse && (
                        <ReverseSubscriptionDialog
                            subscription={sub}
                            patientSlug={patientSlug}
                        />
                    )}
                    {canReactivate && (
                        <ReactivateSubscriptionDialog
                            subscription={sub}
                            patientSlug={patientSlug}
                        />
                    )}
                </div>
            );
        },
    },
];
