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
import { Link } from "@inertiajs/react"
import { Consultation } from "@/types"
import { format } from 'date-fns'; // Importar la función format

export const columns: ColumnDef<Consultation>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "identification",
    header: "Cédula",
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
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.patient?.name} {row.original.patient?.lastname}
        </p>
      )
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
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "scheduled_at",
    header: "Fecha programada",
    cell: ({ row }) => {
      const scheduledAt = new Date(row.original.scheduled_at); // Convertir a objeto Date
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {format(scheduledAt, 'dd/MM/yyyy HH:mm')} {/* Formato deseado */}
        </p>
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: "Estado de pago",
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
              onClick={() => navigator.clipboard.writeText(Consultation.id)}
            >
              Copy Consultation ID
            </DropdownMenuItem> 
            <DropdownMenuSeparator />*/}
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.edit', [row.original.slug ?? row.original.id])} >
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.destroy', [row.original.slug ?? row.original.id])} method="delete">
                Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]