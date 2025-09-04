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
import { Checkbox } from "@/components/ui/checkbox"


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
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "payment_status",
    header: "Estado de pago",
  },
  {
    accessorKey: "created_at",
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
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.edit', [row.original.id])} >
                Editar
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.destroy', [row.original.id])} method="delete">
                Eliminar
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]