import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Link, useForm } from "@inertiajs/react"
import { Doctor } from "@/types"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export const columns: ColumnDef<Doctor>[] = [
  {
    accessorKey: "identification",
    header: "Cédula de identidad",
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.name} {row.original.lastname}
        </p>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { delete: destroy, processing } = useForm();

      const handleDelete = () => {
        destroy(route('doctors.destroy', [row.original.slug ?? row.original.id]), {
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
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('doctors.edit', [row.original.slug ?? row.original.id])} >
                  <Edit /> Editar
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
                  <Trash /> Eliminar
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                <DialogDescription>
                  Esta acción eliminará permanentemente al doctor **{row.original.name} {row.original.lastname}** del sistema.
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
                  {processing ? "Eliminando..." : "Eliminar Doctor"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
