import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Link } from "@inertiajs/react"
import {  Role } from "@/types"


export const columns: ColumnDef<any>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "identification",
    header: "Identificación",
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
    accessorKey: "active",
    header: "Activo",
    cell: ({ row }) => {
      return (
        <span className={row.original.active ? "text-green-500" : "text-red-500"}>
          {row.original.active ? "Activo" : "Inactivo"}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/*<DropdownMenuLabel>Actions</DropdownMenuLabel>
             <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(PaymentMethod {.id)}
            >
              Copy PaymentMethod { ID
            </DropdownMenuItem> 
            <DropdownMenuSeparator />*/}
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('user.edit', [row.original.slug ?? row.original.id])} >
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('user.destroy', [row.original.slug ?? row.original.id])} method="delete">
                Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]