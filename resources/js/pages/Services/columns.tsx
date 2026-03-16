import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Edit } from "lucide-react"
import { Link, useForm } from "@inertiajs/react"
import { Service } from "@/types"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const { delete: destroy, processing } = useForm();

      const handleDelete = () => {
        destroy(route('services.destroy', [row.original.slug ?? row.original.id]), {
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
                <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('services.edit', [row.original.slug ?? row.original.id])} >
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
                  Esta acción eliminará permanentemente el servicio **{row.original.name}**. Esta acción no se puede deshacer.
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
                  {processing ? "Eliminando..." : "Eliminar Servicio"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
