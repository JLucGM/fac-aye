import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Link, useForm } from "@inertiajs/react"
import { Consultation } from "@/types"
import { format } from 'date-fns'; // Importar la función format
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react"

export const columns: ColumnDef<Consultation>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   // enableSorting: false,
  //   // enableHiding: false,
  // },
  {
    accessorKey: "identification",
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
    accessorKey: "patient_id",
    header: "Paciente",
    cell: ({ row }) => {
      const patient = row.original.patient; // Asegúrate de que esto esté cargado
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {patient ? `${patient.name} ${patient.lastname}` : 'No disponible'}
        </p>
      );
    },
  },
  {
    accessorKey: "user_id",
    header: "Tratante",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.user?.name} {row.original.user?.lastname}
        </p>
      )
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Estado",
  // },

  {
    accessorKey: "payment_status",
    header: "Estado de pago",
    cell: ({ row }) => {
      const paymentStatus = row.original.payment_status;

      // Mapear estados a variantes válidas
      let variant: "default" | "destructive" | "secondary" | "outline" = "default";

      if (paymentStatus === "pagado") variant = "default";       // o "secondary"
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
      const scheduledAt = new Date(row.original.created_at); // Convertir a objeto Date
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {format(scheduledAt, 'dd/MM/yyyy HH:mm')} {/* Formato deseado */}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { delete: destroy, processing } = useForm();

      const isPending = row.original.payment_status === "pendiente";

      const handleDelete = () => {
        destroy(route('consultations.destroy', [row.original.id]), {
          onSuccess: () => setShowDeleteDialog(false),
        });
      };

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
                    e.preventDefault(); // Evita que el dropdown cause comportamientos extraños
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  {/* Mantenemos el estilo visual de tus otros botones 
                           pero dentro del ítem del menú 
                        */}
                  <div className={buttonVariants({ variant: 'ghost' }) + ' w-full text-red-600 hover:text-red-600'}>
                    Eliminar
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogDescription>
                  Esta acción eliminará la consulta y descontara **${row.original.amount}** al balance del paciente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                {/* Mantenemos tus estilos de botones aquí también */}
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={processing}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={processing}
                  className={buttonVariants({ variant: 'destructive' })}
                >
                  {processing ? "Eliminando..." : "Eliminar Consulta"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  }
]