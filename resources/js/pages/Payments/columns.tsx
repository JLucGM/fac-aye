import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, Edit, Eye } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import { Payment } from "@/types"; 
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/50 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600",
  parcial: "bg-sky-100 text-sky-800 dark:bg-sky-700/50 dark:text-sky-100 border-sky-300 dark:border-sky-600",
  pagado: "bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-100 border-green-300 dark:border-green-600",
  incobrable: "bg-red-100 text-red-800 dark:bg-red-700/50 dark:text-red-100 border-red-300 dark:border-red-600",
  reembolsado: "bg-purple-100 text-purple-800 dark:bg-purple-700/50 dark:text-purple-100 border-purple-300 dark:border-purple-600",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-300 dark:border-gray-600",
};

const getStatusColor = (status: string | null | undefined): string => {
  const lowerStatus = status?.toLowerCase();
  return statusColors[lowerStatus as keyof typeof statusColors] || statusColors.default;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "created_at",
    header: "Creado",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleString();
    },
  },
  {
    accessorKey: "reference",
    header: "Referencia",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.reference || "N/A"}
        </p>
      );
    },
  },
  {
    accessorKey: "payment_method_id",
    header: "Método de pago",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.payment_method?.name}
        </p>
      );
    },
  },
  {
    accessorKey: "patientName",
    header: "Paciente",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.patientName || "Sin paciente"}
        </p>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      const badgeColorClasses = getStatusColor(status); 
      const combinedClasses = `capitalize text-sm font-medium ${badgeColorClasses}`;

      return (
        <Badge className={combinedClasses} variant="outline">
          {status || "Sin estado"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { delete: destroy, processing } = useForm();

      const handleDelete = () => {
        destroy(route('payments.destroy', [row.original.id]), {
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
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('payments.show', [row.original.id])}>
                  <Eye className="mr-2 h-4 w-4" /> Mostrar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('payments.edit', [row.original.id])}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <div className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start text-red-600 hover:text-red-600'}>
                  <Trash className="mr-2 h-4 w-4" /> Eliminar
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogDescription>
                  Esta acción eliminará permanentemente el pago por un monto de **{row.original.amount}**. Esta acción no se puede deshacer y afectará el balance del paciente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={processing}
                >
                  {processing ? "Eliminando..." : "Eliminar Pago"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
