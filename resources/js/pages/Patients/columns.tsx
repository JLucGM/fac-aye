import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import { PatientResource } from "@/types";
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

export const columns: ColumnDef<PatientResource>[] = [
  {
    accessorKey: "identification",
    header: "Cédula de identidad",
  },
  {
    accessorKey: "full_name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.full_name}
        </p>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    id: "subscriptionStatus",
    header: "Estado de Funcional",
    cell: ({ row }) => {
      const activeSub = row.original.active_subscription;
      const status = activeSub ? 'active' : 'none';
      
      const variantMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
        active: 'default',
        none: 'outline'
      };
      const textMap: Record<string, string> = {
        active: 'Activa',
        none: 'Sin Funcional'
      };
      return <Badge variant={variantMap[status]}>{textMap[status]}</Badge>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { delete: destroy, processing } = useForm();

      const handleDelete = () => {
        destroy(route('patients.destroy', [row.original.slug ?? row.original.id]), {
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
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.show', [row.original.slug ?? row.original.id])}>
                  <Eye className="mr-2 h-4 w-4" /> Mostrar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.edit', [row.original.slug ?? row.original.id])}>
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
                <div className={buttonVariants({ variant: 'ghost' }) + ' w-full text-red-600 hover:text-red-600'}>
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
                  Esta acción eliminará permanentemente al paciente **{row.original.full_name}** y todos sus registros asociados. Esta acción no se puede deshacer.
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
                  {processing ? "Eliminando..." : "Eliminar Paciente"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
