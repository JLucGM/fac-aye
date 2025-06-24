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
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Patient } from "@/types"


export const columns: ColumnDef<Patient>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
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
              onClick={() => navigator.clipboard.writeText(Patient.id)}
            >
              Copy Patient ID
            </DropdownMenuItem> 
            <DropdownMenuSeparator />*/}
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.show', [row.original.slug ?? row.original.id])} >
                <Eye /> Mostrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.edit', [row.original.slug ?? row.original.id])} >
                <Edit /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('patients.destroy', [row.original.slug ?? row.original.id])} method="delete">
                <Trash /> Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]