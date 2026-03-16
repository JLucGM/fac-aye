import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import { Invoice } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Número de Factura",
  },
  {
    accessorKey: "patient.name",
    header: "Paciente",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return patient ? (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {patient.name} {patient.lastname}
        </p>
      ) : (
        <p className="text-sm text-gray-500">N/A</p>
      );
    },
  },
  {
    accessorKey: "invoice_date",
    header: "Fecha de Emisión",
    cell: ({ row }) => {
      const date = new Date(row.original.invoice_date);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    },
  },
  {
    accessorKey: "total_amount",
    header: "Monto Total",
    cell: ({ row }) => {
      return row.original.total_amount;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { delete: destroy, processing } = useForm();

      const handleDelete = () => {
        destroy(route('invoices.destroy', [row.original.id]), {
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
              <DropdownMenuItem
                onClick={() => window.open(route('invoices.pdf', [row.original.id]), '_blank')}
                className="cursor-pointer"
              >
                <div className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar factura
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('invoices.show', [row.original.id])} >
                  <Eye className="mr-2 h-4 w-4" /> Mostrar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('invoices.edit', [row.original.id])} >
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
                  Esta acción eliminará permanentemente la factura **{row.original.invoice_number}**. Esta acción no se puede deshacer.
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
                  {processing ? "Eliminando..." : "Eliminar Factura"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
