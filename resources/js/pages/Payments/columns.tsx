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
import { Payment } from "@/types"

export const columns: ColumnDef<Payment>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
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
  },
  {
    accessorKey: "payment_method_id",
    header: "Método de pago",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.payment_method?.name}
        </p>
      )
    },
  },
  {
    accessorKey: "patient",
    header: "Paciente",
    cell: ({ row }) => {
      const consultations = row.original.consultations || []; // Asegúrate de que sea un array
      if (consultations.length > 0) {
        const patient = consultations[0].patient; // Obtener el primer paciente
        return (
          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {patient?.name} {patient?.lastname}
          </p>
        );
      }
      return <p className="text-sm text-gray-500">Sin paciente</p>;
    },
  },
  {
  accessorKey: "services",
  header: "Servicios",
  cell: ({ row }) => {
    const consultations = row.original.consultations || []; // Asegúrate de que sea un array
    if (consultations.length > 0) {
      // Asegúrate de que services sea un array
      let services = consultations[0]?.services;

      // Si services es un string, parsealo
      if (typeof services === 'string') {
        try {
          services = JSON.parse(services);
        } catch (error) {
          console.error("Error parsing services:", error);
          services = []; // Si hay un error, asigna un array vacío
        }
      }

      // Verifica que services sea un array
      if (Array.isArray(services)) {
        return (
          <div>
            {services.length > 0 ? (
              services.map(service => (
                <p key={service.id} className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {service.name} - $ {service.price}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500">Sin servicios</p>
            )}
          </div>
        );
      }
    }
    return <p className="text-sm text-gray-500">Sin consultas</p>;
  },
}, 
  {

    accessorKey: "amount",
    header: "Monto",
  },
  {
    accessorKey: "status",
    header: "Estado",
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
              onClick={() => navigator.clipboard.writeText(service.id)}
            >
              Copy service ID
            </DropdownMenuItem> 
            <DropdownMenuSeparator />*/}
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.show', [row.original.id])} >
                Mostrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.destroy', [row.original.id])} method="delete">
                Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]