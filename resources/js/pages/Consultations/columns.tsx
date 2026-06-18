import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Link } from "@inertiajs/react"
import { ConsultationResource } from "@/types"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"

export const columns: ColumnDef<ConsultationResource>[] = [
  {
    accessorKey: "patient.identification",
    header: "Cédula de identidad",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.patient?.identification}
        </p>
      )
    },
  },
  {
    accessorKey: "patient.full_name",
    header: "Paciente",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.patient?.full_name || 'No disponible'}
        </p>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: "Tratante",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.user?.name} {row.original.user?.lastname}
        </p>
      )
    },
  },
  {
    accessorKey: "payment_status",
    header: "Estado de pago",
    cell: ({ row }) => {
      const paymentStatus = row.original.payment_status;

      let variant: "default" | "destructive" | "secondary" | "outline" = "default";

      if (paymentStatus === "pagado") variant = "default";
      else if (paymentStatus === "pendiente") variant = "outline";
      else if (paymentStatus === "reembolsado" || paymentStatus === "incobrable") variant = "destructive";

      return (
        <Badge variant={variant} className="capitalize">
          {paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Realizado",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.created_at}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      const isPending = row.original.payment_status === "pendiente";

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  className={buttonVariants({ variant: 'ghost' }) + ' w-full'}
                  href={route('consultations.edit', [row.original.id])}
                >
                  Editar
                </Link>
              </DropdownMenuItem>

              {isPending && (
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <div className={buttonVariants({ variant: 'ghost' }) + ' w-full text-red-600 hover:text-red-600'}>
                    Eliminar
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            routeName="consultations.destroy"
            routeParams={[row.original.id]}
            title="¿Confirmar eliminación?"
          >
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Se eliminará la consulta de <strong>{row.original.patient?.full_name}</strong>.</p>
              {isPending && (
                <p className="text-amber-600 font-medium">Se revertirá la deuda de <strong>${row.original.amount}</strong> del balance del paciente.</p>
              )}
              <p className="text-destructive font-medium">Esta acción no se puede deshacer.</p>
            </div>
          </ConfirmDeleteDialog>
        </>
      );
    },
  }
]
