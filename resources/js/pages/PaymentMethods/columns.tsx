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
import { Badge, MoreHorizontal } from "lucide-react"
import { Link } from "@inertiajs/react"
import { PaymentMethod } from "@/types"


export const columns: ColumnDef<PaymentMethod>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "name",
    header: "Nombre",
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
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payment-methods.edit', [row.original.slug ?? row.original.id])} >
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payment-methods.destroy', [row.original.slug ?? row.original.id])} method="delete">
                Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]