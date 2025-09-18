import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Invoice } from "@/types"; // Importa el tipo Invoice

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Número de Factura",
  },
  {
    accessorKey: "patient.name", // Accede a la propiedad 'name' del objeto 'patient'
    header: "Paciente",
    cell: ({ row }) => {
      // Asegúrate de que 'patient' esté precargado en el backend
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
      // Formatear la fecha si es necesario
      const date = new Date(row.original.invoice_date);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    },
  },
  // {
  //   accessorKey: "due_date",
  //   header: "Fecha de Vencimiento",
  //   cell: ({ row }) => {
  //     const date = new Date(row.original.due_date);
  //     return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  //   },
  // },
  {
    accessorKey: "total_amount",
    header: "Monto Total",
    cell: ({ row }) => {
      // Formatear como moneda
      return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(row.original.total_amount);
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Estado",
  //   cell: ({ row }) => {
  //     const status = row.original.status;
  //     let statusClass = '';
  //     let statusText = '';

  //     switch (status) {
  //       case 'pending':
  //         statusClass = 'bg-yellow-100 text-yellow-800';
  //         statusText = 'Pendiente';
  //         break;
  //       case 'partially_paid':
  //         statusClass = 'bg-blue-100 text-blue-800';
  //         statusText = 'Parcialmente Pagada';
  //         break;
  //       case 'paid':
  //         statusClass = 'bg-green-100 text-green-800';
  //         statusText = 'Pagada';
  //         break;
  //       case 'cancelled':
  //         statusClass = 'bg-red-100 text-red-800';
  //         statusText = 'Cancelada';
  //         break;
  //       default:
  //         statusClass = 'bg-gray-100 text-gray-800';
  //         statusText = 'Desconocido';
  //     }

  //     return (
  //       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
  //         {statusText}
  //       </span>
  //     );
  //   },
  // },
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
            {/* <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem>

              <Button
                variant="ghost"
                onClick={() => window.open(route('invoices.pdf', [row.original.id]), '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar factura
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('invoices.show', [row.original.id])} >
                <Eye className="mr-2 h-4 w-4" /> Mostrar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start'} href={route('invoices.edit', [row.original.id])} >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* Asegúrate de que tu ruta 'invoices.destroy' acepte el ID */}
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full justify-start text-red-600 hover:text-red-800'} href={route('invoices.destroy', [row.original.id])} method="delete" as="button">
                <Trash className="text-red-600 hover:text-red-800 mr-2 h-4 w-4" /> Eliminar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
