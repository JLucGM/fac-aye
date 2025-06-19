import { ColumnDef } from "@tanstack/react-table";
import { Consultation } from "@/types"; // Asegúrate de que la ruta sea correcta
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export const consultationColumns: ColumnDef<Consultation>[] = [
  {
    accessorKey: "scheduled_at",
    header: "Fecha Programada",
    cell: ({ row }) => {
      return new Date(row.original.scheduled_at).toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "consultation_type",
    header: "Tipo de Consulta",
  },
  {
    accessorKey: "payment_status",
    header: "Estado de Pago",
  },
  {
    id: "services",
    header: "Servicios",
    cell: ({ row }) => {
      const services = row.original.services || [];
      return (
        <ul>
          {services.map(service => (
            <li key={service.id}>
              {service.name} - ${service.price}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link className={buttonVariants({ variant: 'outline' }) + ' w-full'} href={route('consultations.edit', [row.original.id])} >
          Editar
        </Link>
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <MoreHorizontal className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     {/*<DropdownMenuLabel>Actions</DropdownMenuLabel>
        //      <DropdownMenuItem
        //       onClick={() => navigator.clipboard.writeText(Consultation.id)}
        //     >
        //       Copy Consultation ID
        //     </DropdownMenuItem> 
        //     <DropdownMenuSeparator />*/}
        //     <DropdownMenuItem>
        //       <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.edit', [row.original.id])} >
        //         Editar
        //       </Link>
        //     </DropdownMenuItem>
        //     {/* <DropdownMenuItem>
        //       <Link className={buttonVariants({ variant: 'ghost' }) + ' w-full'} href={route('consultations.destroy', [row.original.id])} method="delete">
        //         Eliminar
        //       </Link>
        //     </DropdownMenuItem> */}
        //   </DropdownMenuContent>
        // </DropdownMenu>
      )
    },
  },
];
