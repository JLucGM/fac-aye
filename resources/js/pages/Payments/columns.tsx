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
import { MoreHorizontal } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Payment } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Payment>[] = [
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
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.reference || "N/A"}
        </p>
      );
    },
  },
  {
    accessorKey: "payment_method_id",
    header: "Método de pago",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.payment_method?.name}
        </p>
      );
    },
  },
  {
    accessorKey: "patientName", // Nueva columna para el nombre del paciente
    header: "Paciente",
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.patientName || "Sin paciente"}
        </p>
      );
    },
  },
  // {
  //   accessorKey: "services",
  //   header: "Servicios",
  //   cell: ({ row }) => {
  //     const consultations = row.original.consultations || [];
  //     console.log(consultations)
  //     if (consultations.length > 0) {
  //       let services = consultations[0]?.services;

  //       if (typeof services === 'string') {
  //         try {
  //           services = JSON.parse(services);
  //         } catch (error) {
  //           console.error("Error parsing services:", error);
  //           services = [];
  //         }
  //       }

  //       if (Array.isArray(services)) {
  //         return (
  //           <div>
  //             {services.length > 0 ? (
  //               services.map(service => (
  //                 <p key={service.id} className="text-sm font-medium text-gray-900 dark:text-gray-50">
  //                   {service.name} - $ {service.price}
  //                 </p>
  //               ))
  //             ) : (
  //               <p className="text-sm text-gray-500">Sin servicios</p>
  //             )}
  //           </div>
  //         );
  //       }
  //     }
  //     return <p className="text-sm text-gray-500">Sin consultas</p>;
  //   },
  // },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return (
        <p className="capitalize text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.status || "Sin estado"}
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
            <DropdownMenuItem>
              <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('payments.show', [row.original.id])}>
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
      );
    },
  },
];
